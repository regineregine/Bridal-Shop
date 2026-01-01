<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Collection;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collections = [

            [
                'name' => 'Allia',
                'description' => 'Dramatic high-low gown with structured corset bodice',
                'image' => 'pp-3.jpg',
            ],
            [
                'name' => 'Mia',
                'description' => 'Chic tea-length dress with modern A-line silhouette',
                'image' => 'pp-4.jpg',
            ],
            [
                'name' => 'Juliette',
                'description' => 'Timeless long-sleeved gown with boat neck elegance',
                'image' => 'pp-7.webp',
            ],
            [
                'name' => 'Sarah',
                'description' => 'Relaxed flowing gown with modern pocket details',
                'image' => 'pp-10.webp',
            ],
        ];

        foreach ($collections as $collection) {
            Collection::create($collection);
        }
    }
}
