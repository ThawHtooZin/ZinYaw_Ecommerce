<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_listing_id')->constrained()->onDelete('cascade');
            $table->string('sku')->unique();
            $table->string('attribute_name');
            $table->string('attribute_value');
            $table->decimal('additional_price', 15, 2)->default(0.00);
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};