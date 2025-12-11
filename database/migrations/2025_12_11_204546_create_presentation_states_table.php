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
        Schema::create('presentation_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('week_id')->constrained()->cascadeOnDelete();

            // Navigation state
            $table->integer('section_index')->default(0);
            $table->integer('content_index')->default(0);

            // Scripture expansion state (JSON array of "sectionIdx-contentIdx" keys)
            $table->json('expanded_scriptures')->nullable();

            // Question highlight state (when set, only this question shows fullscreen)
            $table->integer('highlighted_question_index')->nullable();

            // Active status
            $table->boolean('is_active')->default(false);

            // Leader tracking
            $table->foreignId('leader_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            // Only one presentation state per week
            $table->unique('week_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_states');
    }
};
