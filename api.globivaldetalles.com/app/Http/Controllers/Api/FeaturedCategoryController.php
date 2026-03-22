<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeaturedCategorySettingResource;
use App\Models\FeaturedCategorySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeaturedCategoryController extends Controller
{
    /**
     * GET /api/featured-category - Obtener la configuración actual (ahora subcategoría)
     */
    public function index(): JsonResponse
    {
        $setting = FeaturedCategorySetting::with('subcategory.category')->first();

        if (!$setting) {
            return response()->json([
                'subcategory_id' => null,
                'subcategory' => null
            ]);
        }

        return (new FeaturedCategorySettingResource($setting))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * PUT /api/featured-category - Actualizar la subcategoría destacada
     */
    public function update(Request $request): FeaturedCategorySettingResource
    {
        $validated = $request->validate([
            'subcategory_id' => 'nullable|exists:subcategories,id'
        ]);

        $setting = FeaturedCategorySetting::first();

        if (!$setting) {
            $setting = FeaturedCategorySetting::create([
                'subcategory_id' => $validated['subcategory_id'] ?? null
            ]);
        } else {
            $setting->update([
                'subcategory_id' => $validated['subcategory_id'] ?? null
            ]);
        }

        $setting->load('subcategory.category');

        return new FeaturedCategorySettingResource($setting);
    }
}
