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
            $table->decimal('bust', 5, 2)->nullable()->after('card_type');
            $table->decimal('waist', 5, 2)->nullable()->after('bust');
            $table->decimal('hips', 5, 2)->nullable()->after('waist');
            $table->decimal('hollow_to_hem', 5, 2)->nullable()->after('hips');
            $table->decimal('height', 5, 2)->nullable()->after('hollow_to_hem');
            $table->text('measurement_notes')->nullable()->after('height');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bust',
                'waist',
                'hips',
                'hollow_to_hem',
                'height',
                'measurement_notes',
            ]);
        });
    }
};

