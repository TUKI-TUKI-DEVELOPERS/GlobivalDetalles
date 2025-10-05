<?php

// Habilita los errores para poder verlos
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Carga el autoload de Laravel
require __DIR__ . '/../vendor/autoload.php';

// Carga el framework
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;

// Inicializa el kernel
$kernel = $app->make(Kernel::class);

// Ejecuta los comandos Artisan
try {
    echo "<pre>";
    $kernel->call('optimize:clear');
    echo "✅ optimize:clear ejecutado\n";

    $kernel->call('config:clear');
    echo "✅ config:clear ejecutado\n";

    $kernel->call('view:clear');
    echo "✅ view:clear ejecutado\n";

    $kernel->call('route:clear');
    echo "✅ route:clear ejecutado\n";

    echo "\n✅ ¡Cachés limpiadas exitosamente!";
    echo "</pre>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
