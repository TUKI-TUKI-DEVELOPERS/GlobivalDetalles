<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nombre
 * @property string $telefono
 * @property string $email
 * @property string $titulo
 * @property string $categoria
 * @property string $mensaje
 * @property bool $leido
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'telefono',
        'email',
        'titulo',
        'categoria',
        'mensaje',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'leido' => false,
    ];
}
