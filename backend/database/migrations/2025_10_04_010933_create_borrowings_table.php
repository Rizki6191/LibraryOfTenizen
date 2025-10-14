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
        Schema::create('borrowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // siapa yang pinjam
            $table->foreignId('book_id')->constrained('book_models')->onDelete('cascade');
            $table->date('borrowed_at')->default(now()); // tanggal pinjam
            $table->date('due_date'); // batas pengembalian
            $table->date('returned_at')->nullable(); // kalau udah dikembalikan
            $table->enum('status', ['borrowed','returned','overdue'])->default('borrowed'); // status peminjaman
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};
