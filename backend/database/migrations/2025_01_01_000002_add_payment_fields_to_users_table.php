<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->string('card_holder_name')->nullable();
      $table->string('card_last_four')->nullable(); // Store only last 4 digits for security
      $table->string('card_expiry')->nullable(); // Store as MM/YY format
      $table->string('card_type')->nullable(); // e.g., Visa, Mastercard
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['card_holder_name', 'card_last_four', 'card_expiry', 'card_type']);
    });
  }
};
