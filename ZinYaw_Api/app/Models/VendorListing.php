<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'base_product_id',
        'vendor_id',
        'price_coins',
        'stock_quantity',
        'is_active',
    ];

    protected $casts = [
        'price_coins' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function baseProduct(): BelongsTo
    {
        return $this->belongsTo(BaseProduct::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }
}