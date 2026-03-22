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
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('precio_de_oferta', 10, 2)->nullable()->after('price');
            $table->integer('stock')->nullable()->default(0)->after('precio_de_oferta');
            $table->string('SKU', 50)->nullable()->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['precio_de_oferta', 'stock', 'SKU']);
        });
    }
};
