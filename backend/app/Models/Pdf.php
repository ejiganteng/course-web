<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pdf extends Model
{
    protected $fillable = [
        'course_id', 'title', 'file_path', 'order_index'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
