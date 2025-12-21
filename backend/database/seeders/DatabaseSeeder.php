<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Collection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'contact_number' => '09123456789',
            'address' => 'address',
            'city' => 'city',
            'zip' => '4023',
            'country' => 'country',
            'gender' => 'Female',
            'date_of_birth' => '2025-01-01',
            'province' => 'province',
            'barangay' => 'barangay',
            'card_holder_name' => 'Test User',
            'card_last_four' => '4242',
            'card_expiry' => '12/28',
            'card_type' => 'Visa',
        ]);

        $this->call([
            ProductSeeder::class,
            CollectionSeeder::class,
        ]);
    }
}
