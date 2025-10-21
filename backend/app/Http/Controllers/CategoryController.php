<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'success' => true,
            'message' => 'Data kategori yang ada',
            'data' => $categories
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
        $validate = $request->validate([
            'name' => 'required|max:50'
        ]);

        $category = Category::create($validate);
        return response()->json([
            'success' => true,
            'message' => 'Berhasil menambahkan kategori atau genre baru',
            'data' => $category
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(category $category)
    {
        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mendapatkan detail kategori',
            'data' => $category
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, category $category)
    {
        $validate = $request->validate([
            'name' => 'required|max:50'
        ]);

        $category->update($validate);
        $category->refresh();

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'berhasil mengupdate kategori',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(category $category)
    {
        $category->delete();

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ada'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
            'data' => $category
        ]);
    }
}
