<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image;

class ImageOptimizer
{
    /**
     * Optimiza y comprime una imagen subida
     *
     * @param UploadedFile $file
     * @param int $maxWidth Ancho máximo en píxeles
     * @param int $quality Calidad JPEG (0-100)
     * @return string Ruta temporal del archivo optimizado
     */
    public static function optimize(UploadedFile $file, int $maxWidth = 1920, int $quality = 85): string
    {
        // Si el archivo es menor a 500KB, no optimizar
        if ($file->getSize() < 512000) {
            return $file->getRealPath();
        }

        $extension = strtolower($file->getClientOriginalExtension());

        // Solo optimizar JPG, PNG y WEBP
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
            return $file->getRealPath();
        }

        try {
            // Cargar la imagen
            $image = Image::make($file->getRealPath());

            // Redimensionar si es muy grande
            if ($image->width() > $maxWidth) {
                $image->resize($maxWidth, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Crear archivo temporal
            $tempPath = sys_get_temp_dir() . '/' . uniqid() . '.' . $extension;

            // Comprimir y guardar
            if (in_array($extension, ['jpg', 'jpeg'])) {
                $image->save($tempPath, $quality);
            } else if ($extension === 'png') {
                // PNG usa un rango diferente (0-9, donde 9 es mayor compresión)
                $pngCompression = (int) ((100 - $quality) / 11);
                $image->save($tempPath, $quality, 'png');
            } else {
                $image->save($tempPath, $quality);
            }

            return $tempPath;

        } catch (\Exception $e) {
            // Si falla la optimización, devolver el archivo original
            \Log::warning('Image optimization failed: ' . $e->getMessage());
            return $file->getRealPath();
        }
    }

    /**
     * Optimiza y convierte CUALQUIER imagen a formato óptimo
     * SIEMPRE optimiza para garantizar compatibilidad con hosting
     */
    public static function optimizeWithGD(UploadedFile $file, int $maxWidth = 1600, int $quality = 75): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // Solo procesar imágenes
        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'])) {
            return $file->getRealPath();
        }

        try {
            $sourcePath = $file->getRealPath();
            $source = null;

            // Crear imagen desde archivo según su tipo
            switch ($extension) {
                case 'jpg':
                case 'jpeg':
                    $source = @imagecreatefromjpeg($sourcePath);
                    break;
                case 'png':
                    $source = @imagecreatefrompng($sourcePath);
                    break;
                case 'webp':
                    $source = @imagecreatefromwebp($sourcePath);
                    break;
                case 'gif':
                    $source = @imagecreatefromgif($sourcePath);
                    break;
                case 'bmp':
                    $source = @imagecreatefrombmp($sourcePath);
                    break;
            }

            if (!$source) {
                \Log::warning('Failed to create image from: ' . $extension);
                return $file->getRealPath();
            }

            $width = imagesx($source);
            $height = imagesy($source);

            // Determinar tamaño objetivo basado en el tamaño original
            $targetWidth = $maxWidth;
            $targetHeight = (int) ($height * ($maxWidth / $width));

            // Si la imagen es pequeña, no agrandar
            if ($width <= $maxWidth) {
                $targetWidth = $width;
                $targetHeight = $height;
            }

            // Calcular si necesitamos reducir más agresivamente
            $estimatedSize = ($targetWidth * $targetHeight * 3) / 1024; // Estimación en KB
            if ($estimatedSize > 1500) { // Si va a ser >1.5MB
                // Reducir más agresivamente
                $targetWidth = (int) ($targetWidth * 0.7);
                $targetHeight = (int) ($targetHeight * 0.7);
                $quality = 70; // Reducir calidad también
            }

            // Crear nueva imagen
            $destination = imagecreatetruecolor($targetWidth, $targetHeight);

            // Fondo blanco para transparencias
            $white = imagecolorallocate($destination, 255, 255, 255);
            imagefill($destination, 0, 0, $white);

            // Redimensionar con alta calidad
            imagecopyresampled(
                $destination, $source,
                0, 0, 0, 0,
                $targetWidth, $targetHeight,
                $width, $height
            );

            // SIEMPRE guardar como JPG (mejor compresión)
            $tempPath = sys_get_temp_dir() . '/' . uniqid() . '.jpg';
            imagejpeg($destination, $tempPath, $quality);

            // Liberar memoria
            imagedestroy($source);
            imagedestroy($destination);

            // Verificar tamaño final
            $finalSize = filesize($tempPath);
            \Log::info('Image optimized', [
                'original_size' => $file->getSize(),
                'final_size' => $finalSize,
                'original_dimensions' => "{$width}x{$height}",
                'final_dimensions' => "{$targetWidth}x{$targetHeight}",
                'compression_ratio' => round((1 - ($finalSize / $file->getSize())) * 100, 2) . '%'
            ]);

            // Si aún es muy grande, comprimir más agresivamente
            if ($finalSize > 1900000) { // >1.9MB
                imagedestroy(imagecreatefromjpeg($tempPath));
                $source = imagecreatefromjpeg($tempPath);

                // Reducir dimensiones aún más
                $targetWidth = (int) ($targetWidth * 0.8);
                $targetHeight = (int) ($targetHeight * 0.8);

                $destination = imagecreatetruecolor($targetWidth, $targetHeight);
                $white = imagecolorallocate($destination, 255, 255, 255);
                imagefill($destination, 0, 0, $white);

                imagecopyresampled(
                    $destination, $source,
                    0, 0, 0, 0,
                    $targetWidth, $targetHeight,
                    imagesx($source), imagesy($source)
                );

                imagejpeg($destination, $tempPath, 65); // Calidad más baja

                imagedestroy($source);
                imagedestroy($destination);

                \Log::info('Applied aggressive compression, new size: ' . filesize($tempPath));
            }

            return $tempPath;

        } catch (\Exception $e) {
            \Log::error('Image optimization failed: ' . $e->getMessage(), [
                'file' => $file->getClientOriginalName(),
                'size' => $file->getSize()
            ]);
            return $file->getRealPath();
        }
    }
}
