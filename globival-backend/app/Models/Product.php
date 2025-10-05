<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'precio_de_oferta',
        'stock',
        'SKU',
        'imagen',
        'sub_category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'precio_de_oferta' => 'decimal:2',
    ];

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }
}