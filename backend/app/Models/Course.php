<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'instructor_id', 'title', 'description', 'price', 'thumbnail', 'is_published'
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'course_categories');
    }

    public function pdfs()
    {
        return $this->hasMany(Pdf::class)->orderBy("order_index");
    }

    // Relasi many-to-many dengan users (pembeli) lewat tabel purchases
    public function buyers()
    {
        return $this->belongsToMany(User::class, 'purchases', 'course_id', 'user_id')
            ->withPivot('purchased_at')
            ->withTimestamps();
    }

    // Relasi ke model Purchase (opsional, kalau butuh akses purchase langsung)
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

}
