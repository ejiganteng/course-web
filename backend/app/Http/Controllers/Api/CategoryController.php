<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Retrieve all categories.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = Category::all();

        return response()->json([
            'message' => 'Data kategori berhasil diambil',
            'data' => $categories,
        ], 200);
    }

    /**
     * Create a new category.
     *
     * @param CategoryRequest $request
     * @return JsonResponse
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'data' => $category,
        ], 201);
    }

    /**
     * Retrieve a specific category by ID.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Detail kategori ditemukan',
            'data' => $category,
        ], 200);
    }

    /**
     * Update an existing category.
     *
     * @param CategoryRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(CategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        $category->update($request->validated());

        return response()->json([
            'message' => 'Kategori berhasil diperbarui',
            'data' => $category,
        ], 200);
    }

    /**
     * Delete a category by ID.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Kategori tidak ditemukan',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Kategori berhasil dihapus',
        ], 200);
    }
}