<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestBaseProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'master_image_url' => ['nullable', 'url'],
            'specs_schema' => ['nullable', 'array'],
        ];
    }
}