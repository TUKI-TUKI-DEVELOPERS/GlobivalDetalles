<?php
$target = '../storage/app/public';  // Ruta relativa desde la carpeta 'public'
$link = 'storage';                  // Esto creará 'public/storage'

echo "🔄 Intentando crear symlink...\n";

// Verificamos si ya existe algo
if (file_exists($link)) {
    if (is_link($link)) {
        echo "⚠️ Ya existe un enlace simbólico en public/storage. No se necesita crear otro.\n";
        echo "📌 Apunta a: " . readlink($link) . "\n";
    } else {
        echo "❌ Ya existe un archivo o carpeta llamado 'storage' en public/, pero no es un symlink.\n";
        echo "🧹 Elimínalo manualmente desde el Administrador de Archivos de cPanel antes de continuar.\n";
    }
    exit;
}

$result = symlink($target, $link);

if ($result) {
    echo "✅ Symlink creado correctamente: public/storage → $target\n";
    echo "🧪 Puedes verificarlo en: /public/storage o accediendo vía navegador.\n";
} else {
    echo "❌ Error al crear symlink. Probablemente por permisos o restricciones del servidor.\n";
    echo "📌 Intenta pedir a Soporte Técnico que lo creen manualmente con: ln -s ../storage/app/public storage\n";
}
