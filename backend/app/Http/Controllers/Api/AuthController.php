<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register
     * @param App\Http\Requests\AuthRequest $request 
     * @return JsonResponse|mixed
     */
    public function register(AuthRequest $request)
    {
        $credentials = $request->validated();

        // Membuat User
        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password'])
        ]);

        // Mengembalikan response
        return response()->json([
            'message' => 'Register berhasil',
            'data' => $user
        ], 201);
    }

    /**
     * Login
     * @param \App\Http\Requests\AuthRequest $request
     * @return JsonResponse|mixed
     */
    public function login(AuthRequest $request)
    {
        $credentials = $request->validated();
        // Jika login gagal
        if(!Auth::attempt($credentials)){
            return response()->json([
                'message' => 'Email atau Password salah',
                'data' => null
            ], 401);
        }
        // Membuat token
        $token = $request->user()
                            ->createToken('api-token')
                            ->plainTextToken;
        return response()->json([
            'message' => "Berhasil login",
            "data" => [
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'token' => $token
            ]
        ]);
    }

    /**
     * Logout
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil', 'data' => null], 200);
    }

}
