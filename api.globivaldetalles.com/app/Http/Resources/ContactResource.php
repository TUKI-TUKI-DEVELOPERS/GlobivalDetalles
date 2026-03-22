<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $nombre
 * @property string $telefono
 * @property string $email
 * @property string $titulo
 * @property string $categoria
 * @property string $mensaje
 * @property bool $leido
 * @property string $created_at
 * @property string $updated_at
 */
class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'telefono' => $this->telefono,
            'email' => $this->email,
            'titulo' => $this->titulo,
            'categoria' => $this->categoria,
            'mensaje' => $this->mensaje,
            'leido' => (bool) $this->leido,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
