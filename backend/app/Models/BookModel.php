<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookModel extends Model
{
    protected $fillable = [
        'title',         // judul buku
        'author',        // nama penulis
        'description',   // deskripsi buku (nullable)
        'cover_image',   // path cover buku (nullable)
        'category_id',   // foreign key ke kategori
        'stock',         // jumlah stok buku
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
