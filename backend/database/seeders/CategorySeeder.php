<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Romance'],          // id 1
            ['name' => 'Self-Help'],        // id 2
            ['name' => 'Biography'],        // id 3
            ['name' => 'Fantasy'],          // id 4
            ['name' => 'Science Fiction'],  // id 5
            ['name' => 'Mystery'],          // id 6
            ['name' => 'Thriller'],         // id 7
            ['name' => 'Horror'],           // id 8
            ['name' => 'History'],          // id 9
            ['name' => 'Business'],         // id 10
            ['name' => 'Health & Fitness'], // id 11
            ['name' => 'Children'],         // id 12
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
