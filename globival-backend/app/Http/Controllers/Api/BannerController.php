<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BannerRequest;
use App\Models\Banner;

class BannerController extends Controller
{
    /**
     * GET /api/banners - Lista de banners
     */
    public function index()
    {
        return response()->json(Banner::latest()->get());
    }

    /**
     * GET /api/banners/{banner} - Detalle de banner
     */
    public function show(Banner $banner)
    {
        return response()->json($banner);
    }

    /**
     * POST /api/banners - Crear banner con imagen (archivo o string)
     */
    public function store(BannerRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image') && is_file($request->file('image'))) {
            $path = $request->file('image')->store('banners', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $banner = Banner::create($data);
        return response()->json($banner, 201);
    }

    /**
     * PUT /api/banners/{banner}/toggle-active - Alternar estado activo
     */
    public function toggleActive(Banner $banner)
    {
        $banner->active = !$banner->active;
        $banner->save();

        return response()->json($banner);
    }

    /**
     * DELETE /api/banners/{banner} - Eliminar banner
     */
    public function destroy(Banner $banner)
    {
        $banner->delete();
        return response()->json(['message' => 'Banner deleted']);
    }
}
