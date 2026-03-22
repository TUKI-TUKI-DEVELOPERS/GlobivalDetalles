<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Bootstrap Laravel
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;

try {
    Artisan::call('migrate:fresh', [
        '--force' => true,
    ]);

    echo "<h2>Migraciones ejecutadas con éxito</h2>";
    echo "<pre>" . Artisan::output() . "</pre>";
} catch (Throwable $e) {
    echo "<h2>Error al ejecutar migrate:fresh</h2>";
    echo "<pre>";
    echo $e->getMessage() . "\n\n";
    echo $e->getTraceAsString();
    echo "</pre>";
}
