<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * GET /api/banners - Lista de banners
     */
    public function index(): AnonymousResourceCollection
    {
        $banners = Banner::latest()->get();

        return BannerResource::collection($banners);
    }

    /**
     * GET /api/banners/{banner} - Detalle de banner
     */
    public function show(Banner $banner): BannerResource
    {
        return new BannerResource($banner);
    }

    /**
     * POST /api/banners - Crear banner con imagen
     */
    public function store(BannerRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Manejo seguro de imagen con optimización automática
        $data['image'] = $this->handleImageUpload($request);

        $banner = Banner::create($data);

        return (new BannerResource($banner))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT|POST /api/banners/{banner}/update - Actualizar banner
     */
    public function update(BannerRequest $request, Banner $banner): BannerResource
    {
        $data = $request->validated();

        // Manejo seguro de imagen (solo si se sube una nueva)
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Eliminar imagen anterior si existe
            if ($banner->image) {
                $oldImagePath = str_replace('/storage/', '', $banner->image);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $data['image'] = $this->handleImageUpload($request);
        } else {
            // Si no se envió nueva imagen, mantener la actual
            unset($data['image']);
        }

        $banner->update($data);

        return new BannerResource($banner);
    }

    /**
     * PUT /api/banners/{banner}/toggle-active - Alternar estado activo
     */
    public function toggleActive(Banner $banner): BannerResource
    {
        $banner->active = !$banner->active;
        $banner->save();

        return new BannerResource($banner);
    }

    /**
     * DELETE /api/banners/{banner} - Eliminar banner
     */
    public function destroy(Banner $banner): JsonResponse
    {
        // Eliminar imagen del storage si existe
        if ($banner->image && Storage::disk('public')->exists(str_replace('/storage/', '', $banner->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $banner->image));
        }

        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully'
        ], Response::HTTP_OK);
    }

    /**
     * Manejo de subida de imagen con conversión y optimización automática
     * Convierte CUALQUIER imagen a formato óptimo JPG
     */
    private function handleImageUpload(Request $request): ?string
    {
        if ($request->hasFile('image') && is_file($request->file('image'))) {
            $file = $request->file('image');

            // SIEMPRE optimizar y convertir a JPG
            $optimizedPath = \App\Services\ImageOptimizer::optimizeWithGD($file);

            // Si se optimizó (siempre debería), crear nuevo UploadedFile
            if ($optimizedPath !== $file->getRealPath()) {
                // Crear UploadedFile con el archivo optimizado
                // Cambiar nombre para reflejar conversión a JPG
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $newFileName = $originalName . '.jpg';

                $optimizedFile = new \Illuminate\Http\UploadedFile(
                    $optimizedPath,
                    $newFileName,
                    'image/jpeg',
                    null,
                    true // test mode para aceptar archivos temporales
                );

                $path = $optimizedFile->store('banners', 'public');

                // Limpiar archivo temporal
                @unlink($optimizedPath);

                \Log::info('Banner image uploaded and optimized', [
                    'original' => $file->getClientOriginalName(),
                    'final' => $newFileName,
                    'path' => $path
                ]);
            } else {
                // Si no se pudo optimizar, usar original
                $path = $file->store('banners', 'public');

                \Log::warning('Banner image uploaded without optimization', [
                    'file' => $file->getClientOriginalName()
                ]);
            }

            return '/storage/' . $path;
        }

        return null;
    }
}
