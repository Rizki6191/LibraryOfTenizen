<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',  // nama kategori
    ];

    // Relasi: kategori punya banyak buku
    public function books()
    {
        return $this->hasMany(BookModel::class);
    }
}
