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


}
