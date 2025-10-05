<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubCategoryRequest;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * GET /api/subcategories - Lista con categoría padre
     */
    public function index()
    {
        return response()->json(SubCategory::with('category')->get());
    }

    /**
     * GET /api/subcategories/{id} - Detalle con categoría padre
     */
    public function show(SubCategory $subcategory)
    {
        return response()->json($subcategory->load('category'));
    }

    /**
     * POST /api/subcategories - Crear subcategoría (protegido)
     */
    public function store(SubCategoryRequest $request)
    {
        $subcategory = SubCategory::create($request->validated());
        return response()->json($subcategory, 201);
    }

    /**
     * PUT /api/subcategories/{id} - Actualizar subcategoría (protegido)
     */
    public function update(SubCategoryRequest $request, SubCategory $subcategory)
    {
        $subcategory->update($request->validated());
        return response()->json($subcategory);
    }

    /**
     * DELETE /api/subcategories/{id} - Eliminar subcategoría (protegido)
     */
    public function destroy(SubCategory $subcategory)
    {
        $subcategory->delete();
        return response()->json(['message' => 'Subcategory deleted']);
    }
}