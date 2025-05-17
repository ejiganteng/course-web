<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            "name" => "admin",
            "email" => "admin@example.test",
            "password" => Hash::make("admin123"),
            "role" => "admin"
        ]);
        User::create([
            "name" => "eji",
            "email" => "eji@example.test",
            "password" => Hash::make("eji123"),
            "role" => "admin"
        ]);
        User::create([
            "name" => "instruktur",
            "email" => "instruktur@example.test",
            "password" => Hash::make("instruktur123"),
            "role" => "instruktur"
        ]);
        User::create([
            "name" => "user",
            "email" => "user@example.test",
            "password" => Hash::make("user123"),
            "role" => "user"
        ]);
    }
}
