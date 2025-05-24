<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class CourseUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'thumbnail' => 'sometimes|image|mimes:jpg,jpeg,png|max:10240',
            'is_published' => 'sometimes|boolean',
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul kursus wajib diisi.',
            'title.string' => 'Judul kursus harus berupa teks.',
            'title.max' => 'Judul kursus tidak boleh lebih dari 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh kurang dari 0.',
            'thumbnail.image' => 'Thumbnail harus berupa gambar.',
            'thumbnail.mimes' => 'Thumbnail harus berupa file dengan format jpg, jpeg, atau png.',
            'thumbnail.max' => 'Ukuran thumbnail maksimal 10MB.',
            'is_published.boolean' => 'Status publikasi harus berupa true atau false.',
            'category_ids.array' => 'Kategori harus berupa array.',
            'category_ids.*.exists' => 'ID kategori tidak valid.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        Log::error('Validasi Update Gagal', [
            'errors' => $validator->errors()->toArray(),
            'payload' => $this->all(),
            'user_id' => optional($this->user())->id,
            'url' => $this->fullUrl(),
            'method' => $this->method(),
        ]);

        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
