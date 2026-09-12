<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShipOrderItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'courier_name' => ['required', 'string', 'max:100'],
            'tracking_number' => ['required', 'string', 'max:100'],
        ];
    }
}