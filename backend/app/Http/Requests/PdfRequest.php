<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pdfs' => 'required|array|min:1',
            'pdfs.*.title' => 'required|string|max:255',
            'pdfs.*.file' => 'required|mimes:pdf|max:10240', // 10MB
            'pdfs.*.order_index' => 'nullable|integer'
        ];
    }
}
