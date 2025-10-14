<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\BookModel;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BorrowingController extends Controller
{
    private function isAdmin(Request $request)
    {
        $user = $request->user();
        return $user && $user->role === 'admin';
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($this->isAdmin($request)) {
            $borrowings = Borrowing::with(['user', 'book'])->get();
        } else {
            $borrowings = Borrowing::with(['book'])
                ->where('user_id', $user->id)
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $borrowings
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($this->isAdmin($request)) {
            $rules = [
                'user_id' => 'required|exists:users,id',
                'book_id' => 'required|exists:book_models,id',
                'borrowed_at' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:borrowed_at',
                'status' => 'nullable|in:borrowed,returned,overdue'
            ];
        } else {
            $rules = [
                'book_id' => 'required|exists:book_models,id',
            ];
        }

        $validated = $request->validate($rules);

        // Cek stok buku
        $book = BookModel::find($validated['book_id']);
        if ($book->stock <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Stok buku tidak tersedia'
            ], 400);
        }

        // ✅ PERBAIKAN 1: Cek apakah buku sedang dipinjam oleh SIAPAPUN
        $bookBorrowed = Borrowing::where('book_id', $validated['book_id'])
            ->whereIn('status', ['borrowed', 'overdue'])
            ->count();

        // Jika jumlah peminjaman aktif >= stok, berarti buku tidak tersedia
        if ($bookBorrowed >= $book->stock) {
            return response()->json([
                'success' => false,
                'message' => 'Buku sedang dipinjam oleh user lain, tidak tersedia'
            ], 400);
        }

        // ✅ PERBAIKAN 2: Cek apakah user ini sudah pinjam buku yang sama
        $userBorrowingId = $this->isAdmin($request) ? $validated['user_id'] : $user->id;
        
        $userActiveBorrowing = Borrowing::where('user_id', $userBorrowingId)
            ->where('book_id', $validated['book_id'])
            ->whereIn('status', ['borrowed', 'overdue'])
            ->first();

        if ($userActiveBorrowing) {
            return response()->json([
                'success' => false,
                'message' => 'Buku ini sedang dipinjam'
            ], 400);
        }

        // Set default values
        if (!$this->isAdmin($request)) {
            $validated['user_id'] = $user->id;
            $validated['borrowed_at'] = Carbon::now()->format('Y-m-d');
            $validated['due_date'] = Carbon::now()->addDays(14)->format('Y-m-d');
            $validated['status'] = 'borrowed';
        } else {
            $validated['borrowed_at'] = $validated['borrowed_at'] ?? Carbon::now()->format('Y-m-d');
            $validated['due_date'] = $validated['due_date'] ?? Carbon::now()->addDays(14)->format('Y-m-d');
            $validated['status'] = $validated['status'] ?? 'borrowed';
        }

        // ✅ PERBAIKAN 3: Kurangi stok hanya jika status borrowed/overdue
        if (in_array($validated['status'], ['borrowed', 'overdue'])) {
            $book->stock -= 1;
            $book->save();
        }

        $borrowing = Borrowing::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil meminjam buku',
            'data' => $borrowing->load(['user', 'book'])
        ], 201);
    }

    public function show(Request $request, Borrowing $borrowing)
    {
        if (!$this->isAdmin($request) && $request->user()->id !== $borrowing->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $borrowing->load(['user', 'book'])
        ]);
    }

    public function update(Request $request, Borrowing $borrowing)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak, hanya admin'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'book_id' => 'sometimes|exists:book_models,id',
            'borrowed_at' => 'sometimes|date',
            'due_date' => 'sometimes|date|after_or_equal:borrowed_at',
            'returned_at' => 'nullable|date',
            'status' => 'sometimes|in:borrowed,returned,overdue'
        ]);

        $oldStatus = $borrowing->status;
        $newStatus = $validated['status'] ?? $oldStatus;

        // Jika status berubah dari borrowed/overdue ke returned
        if (in_array($oldStatus, ['borrowed', 'overdue']) && $newStatus === 'returned') {
            $book = $borrowing->book;
            $book->stock += 1;
            $book->save();

            $validated['returned_at'] = $validated['returned_at'] ?? Carbon::now()->format('Y-m-d');
        }

        // Jika status berubah dari returned ke borrowed/overdue
        if ($oldStatus === 'returned' && in_array($newStatus, ['borrowed', 'overdue'])) {
            $book = $borrowing->book;
            
            // Cek dulu apakah stok cukup
            if ($book->stock <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat mengubah status, stok buku habis'
                ], 400);
            }
            
            $book->stock -= 1;
            $book->save();
        }

        $borrowing->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengubah data peminjaman',
            'data' => $borrowing->load(['user', 'book'])
        ]);
    }

    public function destroy(Request $request, Borrowing $borrowing)
    {
        if (!$this->isAdmin($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak, hanya admin'
            ], 403);
        }

        // Jika peminjaman belum dikembalikan, kembalikan stok
        if (in_array($borrowing->status, ['borrowed', 'overdue'])) {
            $book = $borrowing->book;
            $book->stock += 1;
            $book->save();
        }

        $borrowing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil menghapus data peminjaman'
        ]);
    }

    public function returnBook(Request $request, Borrowing $borrowing)
    {
        $user = $request->user();

        if (!$this->isAdmin($request) && $user->id !== $borrowing->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Ini bukan peminjaman Anda'
            ], 403);
        }

        if ($borrowing->status === 'returned') {
            return response()->json([
                'success' => false,
                'message' => 'Buku sudah dikembalikan sebelumnya'
            ], 400);
        }

        $borrowing->update([
            'status' => 'returned',
            'returned_at' => Carbon::now()->format('Y-m-d')
        ]);

        // Kembalikan stok buku
        $book = $borrowing->book;
        $book->stock += 1;
        $book->save();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengembalikan buku',
            'data' => $borrowing->load(['book'])
        ]);
    }
}