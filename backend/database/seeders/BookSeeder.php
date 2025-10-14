<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookModel;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            // Romance (id 1)
            [
                'title' => 'It Ends With Us',
                'author' => 'Colleen Hoover',
                'description' => 'Novel romance penuh emosi dan konflik keluarga.',
                'cover_image' => 'books/it_ends_with_us.jpg',
                'category_id' => 1,
                'stock' => 10,
            ],
            [
                'title' => 'Ugly Love',
                'author' => 'Colleen Hoover',
                'description' => 'Novel romance tentang cinta dan kehilangan.',
                'cover_image' => 'books/ugly_love.jpg',
                'category_id' => 1,
                'stock' => 8,
            ],

            // Self-Help (id 2)
            [
                'title' => 'Atomic Habits',
                'author' => 'James Clear',
                'description' => 'Buku self-help tentang membangun kebiasaan positif.',
                'cover_image' => 'books/atomic_habits.jpg',
                'category_id' => 2,
                'stock' => 12,
            ],
            [
                'title' => 'The Subtle Art of Not Giving a F*ck',
                'author' => 'Mark Manson',
                'description' => 'Buku self-help dengan pendekatan realistis.',
                'cover_image' => 'books/subtle_art.jpg',
                'category_id' => 2,
                'stock' => 9,
            ],

            // Biography (id 3)
            [
                'title' => 'Spare',
                'author' => 'Prince Harry',
                'description' => 'Autobiografi Prince Harry tentang hidup dan keluarganya.',
                'cover_image' => 'books/spare.jpg',
                'category_id' => 3,
                'stock' => 10,
            ],
            [
                'title' => 'Becoming',
                'author' => 'Michelle Obama',
                'description' => 'Memoar mantan ibu negara Amerika Serikat.',
                'cover_image' => 'books/becoming.jpg',
                'category_id' => 3,
                'stock' => 7,
            ],

            // Fantasy (id 4)
            [
                'title' => 'The Midnight Library',
                'author' => 'Matt Haig',
                'description' => 'Novel tentang pilihan hidup dan kehidupan alternatif.',
                'cover_image' => 'books/midnight_library.jpg',
                'category_id' => 4,
                'stock' => 7,
            ],
            [
                'title' => 'Harry Potter and the Sorcerer\'s Stone',
                'author' => 'J.K. Rowling',
                'description' => 'Buku fantasi klasik tentang dunia sihir.',
                'cover_image' => 'books/harry_potter_1.jpg',
                'category_id' => 4,
                'stock' => 15,
            ],

            // Science Fiction (id 5)
            [
                'title' => 'Dune',
                'author' => 'Frank Herbert',
                'description' => 'Novel science fiction klasik di planet gurun Arrakis.',
                'cover_image' => 'books/dune.jpg',
                'category_id' => 5,
                'stock' => 6,
            ],
            [
                'title' => 'Project Hail Mary',
                'author' => 'Andy Weir',
                'description' => 'Science fiction dengan misi penyelamatan umat manusia.',
                'cover_image' => 'books/project_hail_mary.jpg',
                'category_id' => 5,
                'stock' => 8,
            ],

            // Mystery (id 6)
            [
                'title' => 'The Guest List',
                'author' => 'Lucy Foley',
                'description' => 'Novel misteri pembunuhan di pesta pernikahan.',
                'cover_image' => 'books/the_guest_list.jpg',
                'category_id' => 6,
                'stock' => 5,
            ],

            // Thriller (id 7)
            [
                'title' => 'Verity',
                'author' => 'Colleen Hoover',
                'description' => 'Thriller psikologis penuh misteri.',
                'cover_image' => 'books/verity.jpg',
                'category_id' => 7,
                'stock' => 7,
            ],

            // Horror (id 8)
            [
                'title' => 'The Haunting of Hill House',
                'author' => 'Shirley Jackson',
                'description' => 'Novel horor klasik tentang rumah berhantu.',
                'cover_image' => 'books/hill_house.jpg',
                'category_id' => 8,
                'stock' => 4,
            ],

            // History (id 9)
            [
                'title' => 'Sapiens: A Brief History of Humankind',
                'author' => 'Yuval Noah Harari',
                'description' => 'Sejarah umat manusia dari zaman purba hingga modern.',
                'cover_image' => 'books/sapiens.jpg',
                'category_id' => 9,
                'stock' => 10,
            ],

            // Business (id 10)
            [
                'title' => 'The Lean Startup',
                'author' => 'Eric Ries',
                'description' => 'Buku tentang strategi membangun startup.',
                'cover_image' => 'books/lean_startup.jpg',
                'category_id' => 10,
                'stock' => 6,
            ],

            // Health & Fitness (id 11)
            [
                'title' => 'Thinner, Leaner, Stronger',
                'author' => 'Michael Matthews',
                'description' => 'Panduan kesehatan dan fitness untuk tubuh ideal.',
                'cover_image' => 'books/thinner_leaner_stronger.jpg',
                'category_id' => 11,
                'stock' => 8,
            ],

            // Children (id 12)
            [
                'title' => 'Charlotte\'s Web',
                'author' => 'E.B. White',
                'description' => 'Klasik anak-anak tentang persahabatan antara anak babi dan laba-laba.',
                'cover_image' => 'books/charlottes_web.jpg',
                'category_id' => 12,
                'stock' => 9,
            ],

            [
                'title' => 'Matilda',
                'author' => 'Roald Dahl',
                'description' => 'Novel anak-anak tentang gadis cerdas dengan kekuatan luar biasa.',
                'cover_image' => 'books/matilda.jpg',
                'category_id' => 12,
                'stock' => 10,
            ],
        ];

        foreach ($books as $book) {
            BookModel::create($book);
        }
    }
}
