<?php

namespace App\Http\Controllers;

use App\Models\BookModel;
use Illuminate\Http\Request;

class BookModelController extends Controller
{
/**
 * @OA\Get(
 *     path="/api/books",
 *     summary="Ambil semua buku",
 *     tags={"Books"},
 *     @OA\Response(response=200, description="Berhasil mengambil data buku")
 * )

 * @OA\Post(
 *     path="/api/books",
 *     summary="Tambah buku baru",
 *     tags={"Books"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"title", "author", "category_id"},
 *             @OA\Property(property="title", type="string", example="Atomic Habits"),
 *             @OA\Property(property="author", type="string", example="James Clear"),
 *             @OA\Property(property="category_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(response=201, description="Buku berhasil ditambahkan")
 * )

 * @OA\Put(
 *     path="/api/books/{id}",
 *     summary="Perbarui data buku",
 *     tags={"Books"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID buku",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Judul Baru"),
 *             @OA\Property(property="author", type="string", example="Penulis Baru")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Buku berhasil diperbarui")
 * )

 * @OA\Delete(
 *     path="/api/books/{id}",
 *     summary="Hapus buku",
 *     tags={"Books"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID buku",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(response=200, description="Buku berhasil dihapus")
 * )
 */

    private function isAdmin(Request $request)
    {
        return $request->user()->role === 'admin';
    }

    public function index()
    {
        $books = BookModel::all(); 
        return response()->json([
            'status' => true,
            'message' => 'Ini adalah data semua buku!',
            'data'=> $books
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Hanya admin yang bisa menambah buku'],403);
        }

        $validate = $request->validate([
            'title' => 'required|string|max:255',             
            'author' => 'required|string|max:100',            
            'description' => 'nullable|string',              
            'cover_image' => 'nullable|string',              
            'category_id' => 'required|exists:categories,id',
            'stock' => 'nullable|integer|min:0', 
        ]);

        $book = BookModel::create($validate);
        return response()->json([
            'status' => true,
            'message' => 'Berhasil membuat buku baru',
            'data' => $book
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $book = BookModel::find($id);

        if (!$book) {
        return response()->json([
            'status' => false,
            'message' => 'Data tidak ada'
        ], 404);
    }

        return response()->json([
            'success' => true,
            'message' => 'berhasil mengambil book details',
            'data' => $book
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookModel $bookModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Hanya admin yang bisa mengupdate buku'],403);
        }

         $book = BookModel::find($id);

         if (!$book) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ada'
            ], 404);
        }
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',             
            'author' => 'nullable|string|max:100',            
            'description' => 'nullable|string',              
            'cover_image' => 'nullable|string',              
            'category_id' => 'nullable|exists:categories,id',
            'stock' => 'nullable|integer|min:0', 
        ]);

        // Update data
        $book->update($validated);

        // Refresh agar data terbaru yang dikirim ke frontend
        $book->refresh();


        // Response JSON
        return response()->json([
            'status' => true,
            'message' => 'Berhasil mengupdate Buku',
            'data' => $book
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,$id)
    {
        if (!$this->isAdmin($request)) {
            return response()->json(['success'=>false,'message'=>'Hanya admin yang bisa menghapus buku'],403);
        }

        $book = BookModel::find($id);
        if (!$book) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ada'
            ], 404);
        }
        $book->delete();

        return response()->json([
            'status' => true,
            'message' => 'Buku berhasil Dihapus!'
        ]);
    }
}
