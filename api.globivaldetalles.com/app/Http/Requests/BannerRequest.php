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
        // Detectar si es actualización verificando si existe un banner en la ruta
        $isUpdate = $this->route('banner') !== null;
        $requiredOrSometimes = $isUpdate ? 'sometimes' : 'required';

        // Validación dinámica: si viene archivo
        if ($this->hasFile('image')) {
            $file = $this->file('image');
            $extension = strtolower($file->getClientOriginalExtension());

            $imageRule = match ($extension) {
                'svg' => [$requiredOrSometimes, 'file', 'mimes:svg', 'mimetypes:image/svg+xml', 'max:2048'],
                default => [$requiredOrSometimes, 'file', 'mimes:jpg,jpeg,png,webp,gif,bmp', 'max:10240'],
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
