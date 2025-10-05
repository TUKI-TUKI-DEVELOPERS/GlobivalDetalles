<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Si 'image' es string vacío lo convertimos en null
        if ($this->has('image') && $this->input('image') === '') {
            $this->merge(['image' => null]);
        }
    }

    public function rules(): array
    {
        $requiredOrSometimes = $this->isMethod('post') ? 'required' : 'sometimes';

        // Validación dinámica: si viene archivo
        if ($this->hasFile('image')) {
            $file = $this->file('image');
            $extension = strtolower($file->getClientOriginalExtension());

            $imageRule = match ($extension) {
                'svg' => [$requiredOrSometimes, 'file', 'mimes:svg', 'mimetypes:image/svg+xml', 'max:2048'],
                default => [$requiredOrSometimes, 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
            };
        } else {
            // Si no es archivo, aceptamos string como ruta previa
            $imageRule = [$requiredOrSometimes, 'string', 'max:255'];
        }

        return [
            'title' => ['nullable', 'string', 'max:255'],
            'image' => $imageRule,
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
