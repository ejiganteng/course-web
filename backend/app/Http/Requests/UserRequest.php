<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string'
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $userId = $this->route('id');
            $rules['email'] = 'required|email|unique:users,email,' . $userId;
            $rules['password'] = 'nullable|string|min:8';
        }

        return $rules;
    }
}
