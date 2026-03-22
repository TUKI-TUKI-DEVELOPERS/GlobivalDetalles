<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normaliza y prepara los datos antes de validar.
     */
    protected function prepareForValidation(): void
    {
        // Mapear alias desde el frontend
        if ($this->has('image') && !$this->has('imagen')) {
            $this->merge(['imagen' => $this->input('image')]);
        }
        if ($this->hasFile('image') && !$this->hasFile('imagen')) {
            $this->files->set('imagen', $this->file('image'));
        }
        if ($this->has('subCategoryId') && !$this->has('sub_category_id')) {
            $this->merge(['sub_category_id' => $this->input('subCategoryId')]);
        }

        // Convertir strings vacíos a null para campos opcionales (excepto imagen cuando es update)
        foreach (['description', 'precio_de_oferta', 'stock', 'SKU'] as $field) {
            if ($this->has($field) && $this->input($field) === '') {
                $this->merge([$field => null]);
            }
        }

        // Para imagen, solo convertir a null si es string vacío y NO hay archivo
        if ($this->has('imagen') && $this->input('imagen') === '' && !$this->hasFile('imagen')) {
            $this->merge(['imagen' => null]);
        }

        // Normalizar números
        $normalizeNumber = function ($value) {
            if (is_null($value)) return null;
            if (is_numeric($value)) return $value;
            if (is_string($value)) {
                $clean = preg_replace('/[^\d,\.\-]/', '', $value);
                $clean = str_replace(',', '.', $clean);
                return is_numeric($clean) ? $clean : $value;
            }
            return $value;
        };

        if ($this->has('price')) {
            $this->merge(['price' => $normalizeNumber($this->input('price'))]);
        }
        if ($this->has('precio_de_oferta')) {
            $this->merge(['precio_de_oferta' => $normalizeNumber($this->input('precio_de_oferta'))]);
        }
    }

    public function rules(): array
    {
        // Detectar si es actualización verificando si existe un product en la ruta
        $isUpdate = $this->route('product') !== null;
        $requiredOrSometimes = $isUpdate ? 'sometimes' : 'required';

        // Ahora sin _method=PUT, hasFile() debería funcionar correctamente
        $hasImageFile = $this->hasFile('imagen');

        // Si la solicitud incluye un archivo para 'imagen', validar como imagen
        // Aceptamos más formatos porque se convertirán automáticamente a JPG optimizado
        $imagenRule = $hasImageFile
            ? ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg,gif,bmp', 'max:10240'] // 10MB máximo (se reducirá automáticamente)
            : ['nullable', 'string', 'max:255'];

        return [
            'name' => [$requiredOrSometimes, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => [$requiredOrSometimes, 'numeric', 'min:0'],
            'precio_de_oferta' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'SKU' => ['nullable', 'string', 'max:50'],
            'sub_category_id' => [$requiredOrSometimes, 'integer', 'exists:subcategories,id'],
            'imagen' => $imagenRule,

            // Imágenes adicionales opcionales
            'images' => ['nullable', 'array', 'max:10'], // Máximo 10 imágenes adicionales
            'images.*' => ['file', 'mimes:jpg,jpeg,png,webp,svg,gif,bmp', 'max:10240'], // 10MB máximo cada una
        ];
    }
}
