<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubCategoryRequest;
use App\Http\Resources\SubCategoryResource;
use App\Models\SubCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SubCategoryController extends Controller
{
    /**
     * GET /api/subcategories - Lista con categoría padre
     */
    public function index(): AnonymousResourceCollection
    {
        $subcategories = SubCategory::with('category')->get();

        return SubCategoryResource::collection($subcategories);
    }

    /**
     * GET /api/subcategories/{id} - Detalle con categoría padre
     */
    public function show(SubCategory $subcategory): SubCategoryResource
    {
        $subcategory->load('category');

        return new SubCategoryResource($subcategory);
    }

    /**
     * POST /api/subcategories - Crear subcategoría (protegido)
     */
    public function store(SubCategoryRequest $request): JsonResponse
    {
        $subcategory = SubCategory::create($request->validated());
        $subcategory->load('category');

        return (new SubCategoryResource($subcategory))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT /api/subcategories/{id} - Actualizar subcategoría (protegido)
     */
    public function update(SubCategoryRequest $request, SubCategory $subcategory): SubCategoryResource
    {
        $subcategory->update($request->validated());
        $subcategory->load('category');

        return new SubCategoryResource($subcategory);
    }

    /**
     * DELETE /api/subcategories/{id} - Eliminar subcategoría (protegido)
     */
    public function destroy(SubCategory $subcategory): JsonResponse
    {
        $subcategory->delete();

        return response()->json([
            'message' => 'Subcategory deleted successfully'
        ], Response::HTTP_OK);
    }
}