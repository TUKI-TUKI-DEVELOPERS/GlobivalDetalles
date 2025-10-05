<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * GET /api/products - Lista completa con relaciones
     */
    public function index()
    {
        $products = Product::with(['subCategory.category'])->get();
        return response()->json($products);
    }

    /**
     * GET /api/products/{id} - Detalle individual con relaciones
     */
    public function show(Product $product)
    {
        return response()->json($product->load('subCategory.category'));
    }

    /**
     * POST /api/products - Crear nuevo producto
     */
    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        // Manejo seguro de imagen
        $data['imagen'] = $this->handleImageUpload($request);

        $product = Product::create($data);

        return response()->json($product->load('subCategory.category'), 201);
    }

    /**
     * PUT /api/products/{id} - Actualizar producto existente
     */
    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();

        // Manejo seguro de imagen (solo si se sube una nueva)
        if ($request->hasFile('imagen')) {
            $data['imagen'] = $this->handleImageUpload($request);
        }

        $product->update($data);

        return response()->json($product->load('subCategory.category'));
    }

    /**
     * DELETE /api/products/{id} - Eliminar producto
     */
    public function destroy(Product $product)
    {
        // Opcional: Eliminar imagen del storage si existe
        if ($product->imagen && Storage::disk('public')->exists(str_replace('/storage/', '', $product->imagen))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->imagen));
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

    /**
     * Manejo de subida de imagen con ruta pública
     */
    private function handleImageUpload(Request $request): ?string
    {
        if ($request->hasFile('imagen') && is_file($request->file('imagen'))) {
            $path = $request->file('imagen')->store('products', 'public');
            return '/storage/' . $path;
        }

        return null;
    }
}
