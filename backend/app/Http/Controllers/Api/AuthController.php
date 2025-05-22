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
     * Register a new user.
     *
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function register(AuthRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        // Create new user
        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password']),
            'role' => $credentials['role'] ?? 'user', // Set default role if not provided
        ]);

        return response()->json([
            'message' => 'Register berhasil',
            'data' => $user,
        ], 201);
    }

    /**
     * Authenticate user and generate API token.
     *
     * @param AuthRequest $request
     * @return JsonResponse
     */
    public function login(AuthRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        // Check login credentials
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah',
                'data' => null,
            ], 401);
        }

        // Generate API token
        $token = $request->user()->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Berhasil login',
            'data' => [
                'user_id' => auth()->id(),
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role,
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Log out the authenticated user.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
            'data' => null,
        ], 200);
    }
}