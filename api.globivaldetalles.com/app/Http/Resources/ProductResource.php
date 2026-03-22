<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $price
 * @property string|null $precio_de_oferta
 * @property int|null $stock
 * @property string|null $SKU
 * @property string|null $imagen
 * @property int $sub_category_id
 * @property string $created_at
 * @property string $updated_at
 * @property \App\Models\SubCategory $subCategory
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'precio_de_oferta' => $this->precio_de_oferta ? (float) $this->precio_de_oferta : null,
            'stock' => $this->stock,
            'SKU' => $this->SKU,
            'imagen' => $this->imagen, // Imagen principal
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_path' => $image->image_path,
                        'order' => $image->order,
                    ];
                });
            }),
            'sub_category_id' => $this->sub_category_id,
            'subCategory' => new SubCategoryResource($this->whenLoaded('subCategory')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
