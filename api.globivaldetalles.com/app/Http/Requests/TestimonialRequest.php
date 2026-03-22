<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Aceptamos "image" como string o archivo, si viene string vacío lo convertimos a null
        if ($this->has('image') && $this->input('image') === '') {
            $this->merge(['image' => null]);
        }
    }

    public function rules(): array
    {
        // Detectar si es actualización verificando si existe un testimonial en la ruta
        $isUpdate = $this->route('testimonial') !== null;
        $requiredOrSometimes = $isUpdate ? 'sometimes' : 'required';

        // Ahora sin _method=PUT, hasFile() debería funcionar correctamente
        $hasImageFile = $this->hasFile('image');

        // Detectamos si viene un archivo
        if ($hasImageFile && $this->file('image') !== null) {
            $file = $this->file('image');
            $extension = strtolower($file->getClientOriginalExtension());

            $imageRule = match ($extension) {
                'svg' => [$requiredOrSometimes, 'file', 'mimes:svg', 'mimetypes:image/svg+xml', 'max:2048'],
                default => [$requiredOrSometimes, 'file', 'mimes:jpg,jpeg,png,webp,gif,bmp', 'max:10240'],
            };
        } else {
            // Si no es archivo, permitimos una ruta como string
            $imageRule = [$requiredOrSometimes, 'string', 'max:255'];
        }

        return [
            'name' => [$requiredOrSometimes, 'string', 'max:255'],
            'message' => [$requiredOrSometimes, 'string'],
            'image' => $imageRule,
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
