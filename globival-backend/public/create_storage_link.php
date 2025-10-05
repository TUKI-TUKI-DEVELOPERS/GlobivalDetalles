<?php

function recurse_copy($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while(false !== ($file = readdir($dir))) {
        if (($file !== '.') && ($file !== '..')) {
            $srcPath = $src . '/' . $file;
            $dstPath = $dst . '/' . $file;

            if (is_dir($srcPath)) {
                recurse_copy($srcPath, $dstPath);
            } else {
                copy($srcPath, $dstPath);
            }
        }
    }
    closedir($dir);
}

$from = __DIR__ . '/storage/app/public';
$to   = __DIR__ . '/public/storage';

if (!file_exists($from)) {
    die("❌ La carpeta de origen no existe: $from");
}

recurse_copy($from, $to);

echo "✅ Archivos copiados de storage/app/public a public/storage correctamente.";
