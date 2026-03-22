<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    /**
     * GET /api/categories - Lista de categorías con subcategorías
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::with('subcategories')->get();

        return CategoryResource::collection($categories);
    }

    /**
     * GET /api/categories/{id} - Detalle de categoría con subcategorías
     */
    public function show(Category $category): CategoryResource
    {
        $category->load('subcategories');

        return new CategoryResource($category);
    }

    /**
     * POST /api/categories - Crear categoría (protegido)
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT /api/categories/{id} - Actualizar categoría (protegido)
     */
    public function update(CategoryRequest $request, Category $category): CategoryResource
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    /**
     * DELETE /api/categories/{id} - Eliminar categoría (protegido)
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], Response::HTTP_OK);
    }
}