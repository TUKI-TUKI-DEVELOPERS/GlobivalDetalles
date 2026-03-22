<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $subcategory_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read SubCategory|null $subcategory
 */
class FeaturedCategorySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'subcategory_id',
    ];

    protected $casts = [
        'subcategory_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the featured subcategory.
     */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class);  // ← Con C mayúscula
    }
}