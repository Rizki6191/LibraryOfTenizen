<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('230418'),
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'Muhammad Almer Riwanto',
            'nis' => '230418',        // bisa pakai NIS
            'major' => 'RPL',         // jurusan
            'grade' => '11',          // kelas
            'email' => 'almerriwanto@gmail.com',
            'password' => Hash::make('2304'),
            'role' => 'member',       // default member
        ]);
    }
}
