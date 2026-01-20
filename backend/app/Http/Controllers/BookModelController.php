<?php

namespace App\Http\Controllers;

use App\Models\BookModel;
use Illuminate\Http\Request;

class BookModelController extends Controller
{
    private function isAdmin(Request $request)
    {
        return $request->user()->role === 'admin';
    }

    public function index()
    {
        $books = BookModel::with('category')->get(); 
        // $books = BookModel::all();

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
            'cover_image' => 'nullable',              
            'category_id' => 'required|exists:categories,id',
            'stock' => 'nullable|integer|min:0', 
        ]);

        // Jika FILE diupload
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('books', 'public');
            $validate['cover_image'] = $path;
        }

        // Jika berupa URL
        elseif ($request->cover_image && filter_var($request->cover_image, FILTER_VALIDATE_URL)) {
            $validate['cover_image'] = $request->cover_image;
        }

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
            'cover_image' => 'nullable',              
            'category_id' => 'nullable|exists:categories,id',
            'stock' => 'nullable|integer|min:0', 
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('books', 'public');
            $validated['cover_image'] = $path;
        }

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
