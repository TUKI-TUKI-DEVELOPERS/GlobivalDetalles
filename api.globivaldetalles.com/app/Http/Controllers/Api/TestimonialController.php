<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    /**
     * GET /api/testimonials - Lista de testimonios
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Testimonial::query()->latest();

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $testimonials = $query->get();

        return TestimonialResource::collection($testimonials);
    }

    /**
     * GET /api/testimonials/{testimonial} - Detalle de testimonio
     */
    public function show(Testimonial $testimonial): TestimonialResource
    {
        return new TestimonialResource($testimonial);
    }

    /**
     * POST /api/testimonials - Crear testimonio con imagen
     */
    public function store(TestimonialRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Manejo seguro de imagen con optimización automática
        $data['image'] = $this->handleImageUpload($request);

        $testimonial = Testimonial::create($data);

        return (new TestimonialResource($testimonial))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT|POST /api/testimonials/{testimonial}/update - Actualizar testimonio
     */
    public function update(TestimonialRequest $request, Testimonial $testimonial): TestimonialResource
    {
        $data = $request->validated();

        // Manejo seguro de imagen (solo si se sube una nueva)
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Eliminar imagen anterior si existe
            if ($testimonial->image) {
                $oldImagePath = str_replace('/storage/', '', $testimonial->image);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            $data['image'] = $this->handleImageUpload($request);
        } else {
            // Si no se envió nueva imagen, mantener la actual
            unset($data['image']);
        }

        $testimonial->update($data);

        return new TestimonialResource($testimonial);
    }

    /**
     * PUT /api/testimonials/{testimonial}/toggle-active - Alternar estado activo
     */
    public function toggleActive(Testimonial $testimonial): TestimonialResource
    {
        $testimonial->active = !$testimonial->active;
        $testimonial->save();

        return new TestimonialResource($testimonial);
    }

    /**
     * DELETE /api/testimonials/{testimonial} - Eliminar testimonio
     */
    public function destroy(Testimonial $testimonial): JsonResponse
    {
        // Eliminar imagen del storage si existe
        if ($testimonial->image && Storage::disk('public')->exists(str_replace('/storage/', '', $testimonial->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $testimonial->image));
        }

        $testimonial->delete();

        return response()->json([
            'message' => 'Testimonial deleted successfully'
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

                $path = $optimizedFile->store('testimonials', 'public');

                // Limpiar archivo temporal
                @unlink($optimizedPath);

                \Log::info('Testimonial image uploaded and optimized', [
                    'original' => $file->getClientOriginalName(),
                    'final' => $newFileName,
                    'path' => $path
                ]);
            } else {
                // Si no se pudo optimizar, usar original
                $path = $file->store('testimonials', 'public');

                \Log::warning('Testimonial image uploaded without optimization', [
                    'file' => $file->getClientOriginalName()
                ]);
            }

            return '/storage/' . $path;
        }

        return null;
    }
}
