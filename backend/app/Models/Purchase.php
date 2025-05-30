<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'purchased_at',
    ];

    public $timestamps = true; 

    // Relasi ke User (pembeli)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Course yang dibeli
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
