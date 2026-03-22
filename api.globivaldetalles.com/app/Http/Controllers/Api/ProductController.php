<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\FeaturedCategorySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * GET /api/products - Lista completa con relaciones
     */
    public function index(): AnonymousResourceCollection
    {
        $products = Product::with(['subCategory.category', 'images'])->get();

        return ProductResource::collection($products);
    }

    /**
     * GET /api/products/{id} - Detalle individual con relaciones
     */
    public function show(Product $product): ProductResource
    {
        $product->load(['subCategory.category', 'images']);

        return new ProductResource($product);
    }

    /**
     * GET /api/products/featured - Productos de la subcategoría destacada
     */
    public function featured(): AnonymousResourceCollection
    {
        $setting = FeaturedCategorySetting::first();

        if (!$setting || !$setting->subcategory_id) {
            $products = Product::with(['subCategory.category', 'images'])->limit(8)->get();
            return ProductResource::collection($products);
        }

        $products = Product::with(['subCategory.category', 'images'])
            ->where('sub_category_id', $setting->subcategory_id)
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * POST /api/products - Crear nuevo producto
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['imagen'] = $this->handleImageUpload($request);

        $product = Product::create($data);

        $this->handleAdditionalImages($request, $product);

        $product->load(['subCategory.category', 'images']);

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT|POST /api/products/{id}/update - Actualizar producto existente
     */
    public function update(ProductRequest $request, Product $product): ProductResource
    {
        $data = $request->validated();

        if ($request->has('remove_main_image') && $request->input('remove_main_image') == '1') {
            if ($product->imagen) {
                $oldImagePath = str_replace('/storage/', '', $product->imagen);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }
            $data['imagen'] = null;
        } elseif ($request->hasFile('imagen') && $request->file('imagen')->isValid()) {
            if ($product->imagen) {
                $oldImagePath = str_replace('/storage/', '', $product->imagen);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }
            $data['imagen'] = $this->handleImageUpload($request);
        } else {
            unset($data['imagen']);
        }

        $product->update($data);

        if ($request->has('delete_images')) {
            $imagesToDelete = $request->input('delete_images');
            if (is_array($imagesToDelete)) {
                foreach ($imagesToDelete as $imageId) {
                    $image = $product->images()->find($imageId);
                    if ($image) {
                        $imagePath = str_replace('/storage/', '', $image->image_path);
                        if (Storage::disk('public')->exists($imagePath)) {
                            Storage::disk('public')->delete($imagePath);
                        }
                        $image->delete();
                    }
                }
            }
        }

        $this->handleAdditionalImages($request, $product);

        $product->load(['subCategory.category', 'images']);

        return new ProductResource($product);
    }

    /**
     * DELETE /api/products/{id} - Eliminar producto completo
     */
    public function destroy(Product $product): JsonResponse
    {
        if ($product->imagen && Storage::disk('public')->exists(str_replace('/storage/', '', $product->imagen))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->imagen));
        }

        foreach ($product->images as $image) {
            $imagePath = str_replace('/storage/', '', $image->image_path);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], Response::HTTP_OK);
    }

    /**
     * DELETE /api/products/{product}/images/{imageId}
     * Eliminar una imagen adicional específica del producto.
     */
    public function destroyImage(Product $product, int $imageId): JsonResponse
    {
        $image = $product->images()->find($imageId);

        if (!$image) {
            return response()->json(['message' => 'Imagen no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $imagePath = str_replace('/storage/', '', $image->image_path);
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }

        $image->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente'], Response::HTTP_OK);
    }

    /**
     * Manejo de subida de imagen con conversión y optimización automática.
     * Convierte CUALQUIER imagen a formato óptimo JPG.
     */
    private function handleImageUpload(Request $request): ?string
    {
        if ($request->hasFile('imagen') && is_file($request->file('imagen'))) {
            $file = $request->file('imagen');

            $optimizedPath = \App\Services\ImageOptimizer::optimizeWithGD($file);

            if ($optimizedPath !== $file->getRealPath()) {
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $newFileName = $originalName . '.jpg';

                $optimizedFile = new \Illuminate\Http\UploadedFile(
                    $optimizedPath,
                    $newFileName,
                    'image/jpeg',
                    null,
                    true
                );

                $path = $optimizedFile->store('products', 'public');
                @unlink($optimizedPath);
            } else {
                $path = $file->store('products', 'public');
            }

            return '/storage/' . $path;
        }

        return null;
    }

    /**
     * Manejo de imágenes adicionales para productos.
     * Procesa y almacena múltiples imágenes secundarias con orden.
     */
    private function handleAdditionalImages(Request $request, Product $product): void
    {
        if ($request->hasFile('images')) {
            $images = $request->file('images');

            if (!is_array($images)) {
                $images = [$images];
            }

            $lastOrder = $product->images()->max('order') ?? -1;
            $order = $lastOrder + 1;

            foreach ($images as $imageFile) {
                if ($imageFile->isValid()) {
                    $optimizedPath = \App\Services\ImageOptimizer::optimizeWithGD($imageFile);

                    if ($optimizedPath !== $imageFile->getRealPath()) {
                        $originalName = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                        $newFileName = $originalName . '.jpg';

                        $optimizedFile = new \Illuminate\Http\UploadedFile(
                            $optimizedPath,
                            $newFileName,
                            'image/jpeg',
                            null,
                            true
                        );

                        $path = $optimizedFile->store('products', 'public');
                        @unlink($optimizedPath);
                    } else {
                        $path = $imageFile->store('products', 'public');
                    }

                    $product->images()->create([
                        'image_path' => '/storage/' . $path,
                        'order' => $order,
                    ]);

                    $order++;
                }
            }
        }
    }
}
