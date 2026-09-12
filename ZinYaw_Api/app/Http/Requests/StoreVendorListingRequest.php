<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'base_product_id' => ['required', 'exists:base_products,id'],
            'price_coins' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:1'],
            'variants' => ['nullable', 'array'],
            'variants.*.sku' => ['required_with:variants', 'string', 'unique:product_variants,sku'],
            'variants.*.attribute_name' => ['required_with:variants', 'string'],
            'variants.*.attribute_value' => ['required_with:variants', 'string'],
            'variants.*.additional_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
        ];
    }
}