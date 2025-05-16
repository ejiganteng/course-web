<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get All Users
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'message' => "Data users berhasil di ambil",
            'data' => $users
        ], 200);
    }

    /**
     * Create new User
     * @param \App\Http\Requests\UserRequest $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function store(UserRequest $request)
    {
        $user = $request->validated();
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = $validated['role'] ?? 'user';

        $user = User::create($validated);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data' => $user
        ], 201);
    }

    /**
     * Show users by id
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail user ditemukan',
            'data' => $user
        ], 200);
    }

    /**
     * Update Users
     * @param \App\Http\Requests\UserRequest $request
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data' => $user
        ], 200);
    }

    /**
     * Delete Users by id
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus'], 200);
    }
}
