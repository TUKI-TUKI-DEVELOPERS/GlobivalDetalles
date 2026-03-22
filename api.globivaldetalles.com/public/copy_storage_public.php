<?php

function recursiveCopy($source, $dest) {
    if (!is_dir($source)) return false;

    if (!is_dir($dest)) {
        mkdir($dest, 0755, true);
    }

    $items = scandir($source);
    foreach ($items as $item) {
        if ($item == '.' || $item == '..') continue;

        $srcPath = $source . DIRECTORY_SEPARATOR . $item;
        $destPath = $dest . DIRECTORY_SEPARATOR . $item;

        if (is_dir($srcPath)) {
            recursiveCopy($srcPath, $destPath);
        } else {
            copy($srcPath, $destPath);
        }
    }

    return true;
}

$projectRoot = __DIR__;
$source = $projectRoot . '/storage/app/public';   // ✅ Ruta correcta
$destination = $projectRoot . '/public/storage';  // ✅ Destino correcto

echo "<h2>📂 Copiando archivos reales desde storage/app/public a public/storage</h2>";
echo "<p><strong>Origen:</strong> $source</p>";
echo "<p><strong>Destino:</strong> $destination</p>";

if (!is_dir($source)) {
    echo "<p>❌ La carpeta de origen no existe: $source</p>";
    exit;
}

if (recursiveCopy($source, $destination)) {
    echo "<p>✅ Archivos copiados exitosamente.</p>";
} else {
    echo "<p>❌ Hubo un problema al copiar los archivos.</p>";
}
?>
