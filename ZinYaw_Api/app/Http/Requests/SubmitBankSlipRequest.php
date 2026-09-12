<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitBankSlipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gateway' => ['required', 'in:kbzpay_slip,ayapay_slip'],
            'amount_mmk' => ['required', 'numeric', 'min:1000'],
            'trans_id' => ['required', 'string', 'max:100'],
            'proof_image' => ['required', 'image', 'mimes:jpeg,png,jpg', 'max:5120'], // 5MB max
        ];
    }
}