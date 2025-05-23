<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class PdfRequest extends FormRequest
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
            'pdfs' => 'required|array|min:1',
            'pdfs.*.title' => 'required|string|max:255',
            'pdfs.*.file' => 'required|file|mimes:pdf|max:10240', // 10MB
            'pdfs.*.order_index' => 'nullable|integer|min:0',
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
            'pdfs.required' => 'Data PDF wajib diisi.',
            'pdfs.array' => 'Data PDF harus berupa array.',
            'pdfs.min' => 'Minimal satu PDF harus diunggah.',
            'pdfs.*.title.required' => 'Judul PDF wajib diisi.',
            'pdfs.*.title.string' => 'Judul PDF harus berupa teks.',
            'pdfs.*.title.max' => 'Judul PDF tidak boleh lebih dari 255 karakter.',
            'pdfs.*.file.required' => 'File PDF wajib diunggah.',
            'pdfs.*.file.file' => 'File PDF tidak valid.',
            'pdfs.*.file.mimes' => 'File harus berupa PDF.',
            'pdfs.*.file.max' => 'File PDF tidak boleh lebih dari 10MB.',
            'pdfs.*.order_index.integer' => 'Urutan PDF harus berupa angka.',
            'pdfs.*.order_index.min' => 'Urutan PDF tidak boleh kurang dari 0.',
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
        Log::error('Validasi gagal', [
            'errors' => $validator->errors()->toArray(),
            'payload' => $this->all(),
            'user_id' => optional($this->user())->id,
            'url' => $this->fullUrl(),
        ]);
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal.',
            'errors' => $validator->errors(),
        ], 422));
    }
}