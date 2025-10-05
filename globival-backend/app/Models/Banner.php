<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
