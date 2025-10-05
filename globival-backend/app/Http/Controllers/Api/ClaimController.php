<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClaimRequest;
use App\Models\Claim;

class ClaimController extends Controller
{
    /**
     * GET /api/claims - Lista de reclamaciones (protegido)
     */
    public function index()
    {
        return response()->json(Claim::latest()->get());
    }

    /**
     * GET /api/claims/{id} - Detalle de reclamación (protegido)
     */
    public function show(Claim $claim)
    {
        return response()->json($claim);
    }

    /**
     * POST /api/claims - Crear reclamación (público)
     */
    public function store(ClaimRequest $request)
    {
        $claim = Claim::create($request->validated());
        return response()->json($claim, 201);
    }
}
