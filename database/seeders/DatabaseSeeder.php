<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create the leader user
        User::firstOrCreate(
            ['email' => 'brian@brianslaght.com'],
            [
                'name' => 'Brian Slaght',
                'password' => 'Tjrnb9093322!!',
                'email_verified_at' => now(),
                'is_leader' => true,
            ]
        );

        // Seed the series data
        $this->call([
            SeriesSeeder::class,
        ]);
    }
}
