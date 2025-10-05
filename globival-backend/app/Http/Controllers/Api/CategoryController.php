<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * GET /api/categories - Lista de categorías
     */
    public function index()
    {
        return response()->json(Category::all());
    }

    /**
     * GET /api/categories/{id} - Detalle de categoría
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * POST /api/categories - Crear categoría (protegido)
     */
    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return response()->json($category, 201);
    }

    /**
     * PUT /api/categories/{id} - Actualizar categoría (protegido)
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return response()->json($category);
    }

    /**
     * DELETE /api/categories/{id} - Eliminar categoría (protegido)
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}