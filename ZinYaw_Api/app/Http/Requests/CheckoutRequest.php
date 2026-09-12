<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CashoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_mmk' => ['required', 'numeric', 'min:5000'],
            'payout_account_type' => ['required', 'in:kbzpay,ayapay,wavepay,bank'],
            'account_number' => ['required', 'string', 'max:100'],
            'account_name' => ['required', 'string', 'max:255'],
        ];
    }
}