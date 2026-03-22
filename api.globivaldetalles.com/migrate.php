<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

use Illuminate\Support\Facades\Artisan;

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Ejecutamos migraciones dentro de un try/catch
try {
    $kernel->bootstrap();

    Artisan::call('migrate', [
        '--force' => true,
    ]);

    echo "<h2 style='color:green;'>✅ Migraciones ejecutadas correctamente</h2>";
    echo "<pre>" . Artisan::output() . "</pre>";
} catch (Throwable $e) {
    echo "<h2 style='color:red;'>❌ Error al ejecutar migraciones</h2>";
    echo "<pre>";
    echo $e->getMessage() . "\n\n";
    echo $e->getTraceAsString();
    echo "</pre>";
}
