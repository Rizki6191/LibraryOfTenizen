<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_models', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // judul buku
            $table->string('author'); // nama penulis
            $table->text('description')->nullable(); // deskripsi buku
            $table->string('cover_image')->nullable(); // path cover buku (misal: books/harrypotter.jpg)
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->integer('stock')->default(0); // jumlah stok buku
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_models');
    }
};
