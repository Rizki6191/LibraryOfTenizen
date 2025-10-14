<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',      // foreign key peminjam
        'book_id',      // foreign key buku yang dipinjam
        'borrowed_at',  // tanggal pinjam
        'due_date',     // batas pengembalian
        'returned_at',  // tanggal dikembalikan, nullable
        'status',       // borrowed, returned, overdue
    ];

    // Relasi ke user (peminjam)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke book
    public function book()
    {
        return $this->belongsTo(BookModel::class, 'book_id');
    }
}
