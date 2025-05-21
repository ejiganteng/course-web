<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable|string',
            'is_published' => 'boolean',
            'category_ids' => 'array',
            'category_ids.*' => 'exists:categories,id',

            // Tambahan: PDF
            'pdfs' => 'nullable|array',
            'pdfs.*.title' => 'required_with:pdfs|string|max:255',
            'pdfs.*.file' => 'required_with:pdfs|file|mimes:pdf|max:10240',
            'pdfs.*.order_index' => 'nullable|integer',
        ];
    }

}
