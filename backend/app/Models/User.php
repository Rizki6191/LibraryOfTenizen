<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'nis',
        'major',
        'grade',
        'email',
        'password',
        'role', 
    ];

    // auto hash password
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    // Relasi: user punya banyak peminjaman
    public function borrowings()
    {
        return $this->hasMany(Borrowing::class);
    }

    // Relasi: jika admin punya buku atau kategori tertentu (opsional)
    public function books()
    {
        return $this->hasMany(BookModel::class);
    }
}
