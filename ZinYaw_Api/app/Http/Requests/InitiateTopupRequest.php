<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitiateTopupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gateway' => ['required', 'in:kbzpay,ayapay'],
            'amount_mmk' => ['required', 'numeric', 'min:1000'],
        ];
    }
}