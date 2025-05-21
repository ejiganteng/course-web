<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\PdfRequest;
use App\Models\Pdf;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    public function store(PdfRequest $request, Course $course)
    {
        // Cek apakah user adalah instruktur dari course ini
        if ($course->instructor_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $savedPdfs = [];

        foreach ($request->pdfs as $pdfData) {
            $file = $pdfData['file'];
            $fileName = time() . '-' . uniqid() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('public/course_pdfs', $fileName);

            $pdf = Pdf::create([
                'course_id' => $course->id,
                'title' => $pdfData['title'],
                'file_path' => $path,
                'order_index' => $pdfData['order_index'] ?? 0
            ]);

            $savedPdfs[] = [
                'id' => $pdf->id,
                'title' => $pdf->title,
                'url' => asset(str_replace('public/', 'storage/', $pdf->file_path)),
                'order_index' => $pdf->order_index
            ];
        }

        return response()->json([
            'message' => 'PDF berhasil ditambahkan ke course',
            'pdfs' => $savedPdfs
        ], 201);
    }
}
