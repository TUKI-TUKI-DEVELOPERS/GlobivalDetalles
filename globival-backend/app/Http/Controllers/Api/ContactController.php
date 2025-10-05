<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Models\Contact;

class ContactController extends Controller
{
    /**
     * GET /api/contacts - Lista de contactos (protegido)
     */
    public function index()
    {
        return response()->json(Contact::latest()->get());
    }

    /**
     * GET /api/contacts/{id} - Detalle de contacto (protegido)
     */
    public function show(Contact $contact)
    {
        return response()->json($contact);
    }

    /**
     * POST /api/contacts - Crear contacto (público)
     */
    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());
        return response()->json($contact, 201);
    }

    /**
     * PUT /api/contacts/{contact}/read - Marcar como leído
     */
    public function markAsRead(Contact $contact)
    {
        $contact->leido = true;
        $contact->save();

        return response()->json($contact);
    }

    /**
     * DELETE /api/contacts/{contact} - Eliminar contacto (protegido)
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted']);
    }
}
