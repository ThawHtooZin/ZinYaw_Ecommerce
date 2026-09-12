<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTopup extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'method',
        'amount_mmk',
        'trans_id',
        'proof_image_path',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'amount_mmk' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}