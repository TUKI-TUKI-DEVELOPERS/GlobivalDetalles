<?php
use Illuminate\Support\Facades\Artisan;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Borrar y recrear TODAS las tablas
Artisan::call('migrate:fresh', [
    '--force' => true
]);

echo "<pre>" . Artisan::output() . "</pre>";
