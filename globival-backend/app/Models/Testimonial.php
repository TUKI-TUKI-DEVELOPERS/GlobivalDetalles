<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'message',
        'image',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
