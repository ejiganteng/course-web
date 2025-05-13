<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AuthRequest extends FormRequest
{
    public function authorize()
    {
        // kalau semua orang boleh akses route ini, cukup true
        return true;
    }

    public function rules()
    {
        // Kita cek route name untuk atur rules berbeda
        if ($this->routeIs('api.register')) {
            return [
                'name'                  => 'required', 'string', 'max:255',
                'email'                 => 'required', 'email', 'unique:users,email',
                'password'              => 'required', 'confirmed', 'min:8',
            ];
        }

        if ($this->routeIs('api.login')) {
            return [
                'email'    => 'required', 'email',
                'password' => 'required',
            ];
        }

        return [];
    }
}
