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
        Schema::create('weeks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('series_id')->constrained()->cascadeOnDelete();
            $table->integer('week_number');
            $table->string('title');
            $table->text('question');
            $table->string('icon');
            $table->text('recap')->nullable();
            $table->string('next_week_title')->nullable();
            $table->text('next_week_homework')->nullable();
            $table->json('sections');
            $table->timestamps();

            $table->unique(['series_id', 'week_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weeks');
    }
};
