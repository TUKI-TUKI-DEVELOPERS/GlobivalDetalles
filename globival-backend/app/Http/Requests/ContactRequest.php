<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:100'],
            'telefono' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'max:150'],
            'titulo' => ['required', 'string', 'max:100'],
            'categoria' => ['required', 'string', 'max:100'],
            'mensaje' => ['required', 'string'],
            'leido' => ['sometimes', 'boolean'],
        ];
    }
}
