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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('major', ['BR','BD','MP','ML','AKL1','AKL2','RPL'])->nullable()->change();
            $table->enum('grade', ['10','11','12'])->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('major', ['BR','BD','MP','ML','AKL1','AKL2','RPL'])->nullable(false)->change();
            $table->enum('grade', ['10','11','12'])->nullable(false)->change();
        });
    }
};
