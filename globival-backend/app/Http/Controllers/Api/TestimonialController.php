<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * GET /api/testimonials - Lista de testimonios
     */
    public function index(Request $request)
    {
        $query = Testimonial::query()->latest();
        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }
        return response()->json($query->get());
    }

    /**
     * GET /api/testimonials/{testimonial} - Detalle de testimonio
     */
    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }

    /**
     * POST /api/testimonials - Crear testimonio con imagen (archivo o string)
     */
    public function store(TestimonialRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image') && is_file($request->file('image'))) {
        $path = $request->file('image')->store('testimonials', 'public');
        $data['image'] = '/storage/' . $path;
    }

    $testimonial = Testimonial::create($data);
    return response()->json($testimonial, 201);
}


    /**
     * PUT /api/testimonials/{testimonial}/toggle-active - Alterna estado activo
     */
    public function toggleActive(Testimonial $testimonial)
    {
        $testimonial->active = ! $testimonial->active;
        $testimonial->save();

        return response()->json($testimonial);
    }

    /**
     * DELETE /api/testimonials/{testimonial} - Eliminar testimonio (protegido)
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted']);
    }
}
