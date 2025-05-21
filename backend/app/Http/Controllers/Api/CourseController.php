<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Pdf;
use App\Http\Requests\CourseRequest;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query();

        if ($request->has('published')) {
            $query->where('is_published', $request->published);
        }

        return response()->json([
            'message' => 'Daftar kursus',
            'data' => $query->with(['instructor','categories', 'pdfs'])->get()
        ]);
    }


    public function store(CourseRequest $request)
    {
        // Simpan course dulu
        $course = Course::create([
            ...$request->validated(),
            'instructor_id' => auth()->id()
        ]);

        // Sync kategori
        $course->categories()->sync($request->category_ids);


        return response()->json([
            'message' => 'Kursus berhasil dibuat beserta PDF-nya',
            'data' => $course->load(['instructor', 'categories'])
        ], 201);
    }

    public function show(Course $course)
    {
        return response()->json([
            'message' => 'Detail kursus',
            'data' => $course->load(['instructor', 'categories', 'pdfs'])
        ]);
    }

    public function update(CourseRequest $request, Course $course)
    {
        $course->update($request->validated());
        $course->categories()->sync($request->category_ids);

        return response()->json([
            'message' => 'Kursus berhasil diperbarui',
            'data' => $course->load(['instructor', 'categories'])
        ]);
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return response()->json([
            'message' => 'Kursus berhasil dihapus'
        ]);
    }
}
