<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Retrieve all courses with optional published filter.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()->with(['instructor', 'categories', 'pdfs']);

        if ($request->has('published')) {
            $query->where('is_published', filter_var($request->published, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json([
            'message' => 'Daftar kursus',
            'data' => $query->get(),
        ], 200);
    }

    /**
     * Create a new course.
     *
     * @param CourseRequest $request
     * @return JsonResponse
     */
    public function store(CourseRequest $request): JsonResponse
    {
        // Simpan file thumbnail
        $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');

        // Simpan data ke database
        $course = Course::create([
            ...$request->validated(),
            'thumbnail' => $thumbnailPath,
            // 'is_published' => true,
            'instructor_id' => auth()->id(),
        ]);

        // Sync kategori jika ada
        if ($request->has('category_ids')) {
            $course->categories()->sync($request->category_ids);
        }

        return response()->json([
            'message' => 'Kursus berhasil dibuat',
            'data' => $course->load(['instructor', 'categories']),
        ], 201);
    }


    /**
     * Retrieve a specific course with related data.
     *
     * @param Course $course
     * @return JsonResponse
     */
    public function show(Course $course): JsonResponse
    {
        return response()->json([
            'message' => 'Detail kursus',
            'data' => $course->load(['instructor', 'categories', 'pdfs']),
        ], 200);
    }

    /**
     * Update an existing course.
     *
     * @param CourseRequest $request
     * @param Course $course
     * @return JsonResponse
     */
    public function update(CourseRequest $request, Course $course): JsonResponse
    {
        $data = $request->validated();

        // Cek apakah ada file baru
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail'] = $thumbnailPath;
        }

        $course->update($data);

        // Sync kategori jika ada
        if ($request->has('category_ids')) {
            $course->categories()->sync($request->category_ids);
        }

        return response()->json([
            'message' => 'Kursus berhasil diperbarui',
            'data' => $course->load(['instructor', 'categories']),
        ], 200);
    }


    /**
     * Delete a course.
     *
     * @param Course $course
     * @return JsonResponse
     */
    public function destroy(Course $course): JsonResponse
    {
        $course->delete();

        return response()->json([
            'message' => 'Kursus berhasil dihapus',
        ], 200);
    }
}