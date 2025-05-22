<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CourseRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable|string|url',
            'is_published' => 'boolean',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ];
    }

    /**
     * Dapatkan pesan error kustom untuk validasi.
     *
     * @return array
     */
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
            'thumbnail.string' => 'Thumbnail harus berupa teks.',
            'thumbnail.url' => 'Thumbnail harus berupa URL yang valid.',
            'is_published.boolean' => 'Status publikasi harus berupa true atau false.',
            'category_ids.array' => 'Kategori harus berupa array.',
            'category_ids.*.exists' => 'ID kategori tidak valid.',
        ];
    }

    /**
     * Tangani kegagalan validasi.
     *
     * @param Validator $validator
     * @return void
     * @throws HttpResponseException
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal.',
            'errors' => $validator->errors(),
        ], 422));
    }
}