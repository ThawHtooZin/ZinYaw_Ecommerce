<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_listing_id',
        'sku',
        'attribute_name',
        'attribute_value',
        'additional_price',
        'stock',
    ];

    protected $casts = [
        'additional_price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function vendorListing(): BelongsTo
    {
        return $this->belongsTo(VendorListing::class);
    }
}