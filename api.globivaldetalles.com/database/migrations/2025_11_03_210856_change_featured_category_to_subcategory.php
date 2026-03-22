<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('featured_category_settings', function (Blueprint $table) {
            // Eliminar la foreign key y columna anterior
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            // Agregar nueva columna para subcategoría
            $table->foreignId('subcategory_id')->nullable()->constrained('subcategories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('featured_category_settings', function (Blueprint $table) {
            // Revertir: eliminar subcategory_id
            $table->dropForeign(['subcategory_id']);
            $table->dropColumn('subcategory_id');

            // Restaurar category_id
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
        });
    }
};
