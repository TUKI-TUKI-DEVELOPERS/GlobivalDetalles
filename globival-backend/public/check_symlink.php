<?php
header('Content-Type: text/plain');

// Rutas base
$projectRoot = dirname(__DIR__); // asume que este archivo está en public/
$storageAppPublic = $projectRoot . '/storage/app/public';
$publicStorage = $projectRoot . '/public/storage';

// Mensajes acumulativos
$log = [];

$log[] = "🔍 Verificación de symlink Laravel: public/storage → storage/app/public";
$log[] = "📂 Ruta esperada de destino: $storageAppPublic";
$log[] = "📂 Ruta esperada de enlace: $publicStorage";
$log[] = "------------------------------------------";

// 1. Verifica si existe el enlace simbólico
if (file_exists($publicStorage)) {
    if (is_link($publicStorage)) {
        $target = readlink($publicStorage);
        $log[] = "✅ El enlace simbólico *existe* en public/storage.";
        $log[] = "📌 El symlink apunta a: $target";

        // 2. Verifica que el enlace apunte correctamente
        if (realpath($storageAppPublic) === realpath($publicStorage)) {
            $log[] = "✅ El enlace apunta correctamente a storage/app/public.";
        } else {
            $log[] = "⚠️ El enlace simbólico NO apunta exactamente a storage/app/public.";
        }

        // 3. Intenta leer archivos dentro del symlink
        $testDir = $publicStorage . '/testimonials';
        if (is_dir($testDir)) {
            $files = scandir($testDir);
            $files = array_diff($files, ['.', '..']);
            if (count($files) > 0) {
                $log[] = "✅ Acceso exitoso a archivos en storage/testimonials (ej: " . reset($files) . ")";
            } else {
                $log[] = "ℹ️ El directorio storage/testimonials está vacío, pero accesible.";
            }
        } else {
            $log[] = "⚠️ El directorio testimonials no existe dentro de storage.";
        }

    } else {
        $log[] = "❌ 'public/storage' existe pero NO es un enlace simbólico (es carpeta o archivo común).";
        $log[] = "🛠️ Debes eliminarlo y crear correctamente el symlink.";
    }
} else {
    $log[] = "❌ El enlace simbólico 'public/storage' NO existe.";
    $log[] = "🛠️ Necesitas crear el symlink con: php artisan storage:link (o hacerlo manualmente)";
}

$log[] = "------------------------------------------";
$log[] = "📌 Diagnóstico completado a las " . date('Y-m-d H:i:s');

echo implode("\n", $log);
