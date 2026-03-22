<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClaimRequest;
use App\Http\Resources\ClaimResource;
use App\Models\Claim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ClaimController extends Controller
{
    /**
     * GET /api/claims - Lista de reclamaciones (protegido)
     */
    public function index(): AnonymousResourceCollection
    {
        $claims = Claim::latest()->get();

        return ClaimResource::collection($claims);
    }

    /**
     * GET /api/claims/{id} - Detalle de reclamación (protegido)
     */
    public function show(Claim $claim): ClaimResource
    {
        return new ClaimResource($claim);
    }

    /**
     * POST /api/claims - Crear reclamación (público)
     */
    public function store(ClaimRequest $request): JsonResponse
    {
        $claim = Claim::create($request->validated());

        return (new ClaimResource($claim))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
