<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BaseProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'requested_by_user_id',
        'title',
        'brand',
        'description',
        'master_image_url',
        'specs_schema',
        'approval_status',
        'rejection_reason',
    ];

    protected $casts = [
        'specs_schema' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function vendorListings(): HasMany
    {
        return $this->hasMany(VendorListing::class);
    }
}