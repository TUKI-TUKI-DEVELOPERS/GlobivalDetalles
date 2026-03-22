<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ContactController extends Controller
{
    /**
     * GET /api/contacts - Lista de contactos (protegido)
     */
    public function index(): AnonymousResourceCollection
    {
        $contacts = Contact::latest()->get();

        return ContactResource::collection($contacts);
    }

    /**
     * GET /api/contacts/{id} - Detalle de contacto (protegido)
     */
    public function show(Contact $contact): ContactResource
    {
        return new ContactResource($contact);
    }

    /**
     * POST /api/contacts - Crear contacto (público)
     */
    public function store(ContactRequest $request): JsonResponse
    {
        $contact = Contact::create($request->validated());

        return (new ContactResource($contact))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * PUT /api/contacts/{contact}/read - Marcar como leído
     */
    public function markAsRead(Contact $contact): ContactResource
    {
        $contact->leido = true;
        $contact->save();

        return new ContactResource($contact);
    }

    /**
     * DELETE /api/contacts/{contact} - Eliminar contacto (protegido)
     */
    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted successfully'
        ], Response::HTTP_OK);
    }
}
