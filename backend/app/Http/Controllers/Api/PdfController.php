<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PdfRequest;
use App\Models\Course;
use App\Models\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    /**
     * Upload PDFs to a specific course.
     *
     * @param PdfRequest $request
     * @param int $id Course ID
     * @return JsonResponse
     */
    public function upload(PdfRequest $request, int $id): JsonResponse
    {
        // Ensure course exists
        $course = Course::findOrFail($id);

        // Pastikan pengguna adalah instruktur dari course terkait
        if ($course->instruktur_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk upload PDF ini.',
            ], 403);
        }

        $savedPdfs = [];

        foreach ($request->validated()['pdfs'] as $pdfData) {
            $file = $pdfData['file'];
            $fileName = time() . '-' . uniqid() . '-' . str_replace(' ', '-', $file->getClientOriginalName());
            $path = $file->storeAs('public/course_pdfs', $fileName);

            $pdf = Pdf::create([
                'course_id' => $id,
                'title' => $pdfData['title'],
                'file_path' => $path,
                'order_index' => $pdfData['order_index'] ?? 0,
            ]);

            $savedPdfs[] = [
                'id' => $pdf->id,
                'title' => $pdf->title,
                'url' => asset(str_replace('public/', 'storage/', $pdf->file_path)),
                'order_index' => $pdf->order_index,
            ];
        }

        return response()->json([
            'message' => 'PDF berhasil ditambahkan ke course',
            'pdfs' => $savedPdfs,
        ], 201);
    }

    /**
     * Download a PDF by ID.
     *
     * @param int $id PDF ID
     * @return mixed
     */
    public function downloadById(int $id)
    {
        $pdf = Pdf::findOrFail($id);

        if (!Storage::exists($pdf->file_path)) {
            return response()->json([
                'message' => 'File tidak ditemukan',
            ], 404);
        }

        return Storage::download($pdf->file_path, $pdf->title . '.pdf');
    }

    /**
     * Delete a PDF by ID.
     *
     * @param int $id PDF ID
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $pdf = Pdf::findOrFail($id);

        // Pastikan pengguna adalah instruktur dari course terkait
        if ($pdf->course->instructor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk menghapus PDF ini.',
            ], 403);
        }

        if (Storage::exists($pdf->file_path)) {
            Storage::delete($pdf->file_path);
        }

        $pdf->delete();

        return response()->json([
            'message' => 'PDF berhasil dihapus',
        ], 200);
    }

    /**
     * Perbarui PDF berdasarkan ID.
     *
     * @param Request $request
     * @param int $id ID PDF
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $pdf = Pdf::findOrFail($id);

        // Pastikan pengguna adalah instruktur dari course terkait
        if ($pdf->course->instructor_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki izin untuk memperbarui PDF ini.',
            ], 403);
        }

        $request->validate([
            'pdfs' => 'required|array|min:1',
            'pdfs.*.title' => 'nullable|string|max:255',
            'pdfs.*.order_index' => 'nullable|integer|min:0',
            'pdfs.*.file' => 'nullable|file|mimes:pdf|max:10240', // 10MB
        ]);

        $pdfData = $request->pdfs[0];

        // Perbarui title dan order_index jika disediakan
        if (isset($pdfData['title'])) {
            $pdf->title = $pdfData['title'];
        }

        if (isset($pdfData['order_index'])) {
            $pdf->order_index = $pdfData['order_index'];
        }

        // Tangani unggahan file jika disediakan
        if (isset($pdfData['file']) && $pdfData['file']->isValid()) {
            // Hapus file lama jika ada
            if (Storage::exists($pdf->file_path)) {
                Storage::delete($pdf->file_path);
            }

            // Simpan file baru
            $file = $pdfData['file'];
            $fileName = time() . '-' . uniqid() . '-' . str_replace(' ', '-', $file->getClientOriginalName());
            $path = $file->storeAs('public/course_pdfs', $fileName);
            $pdf->file_path = $path;
        }

        $pdf->save();

        return response()->json([
            'message' => 'PDF berhasil diperbarui',
            'pdf' => [
                'id' => $pdf->id,
                'title' => $pdf->title,
                'url' => asset(str_replace('public/', 'storage/', $pdf->file_path)),
                'order_index' => $pdf->order_index,
            ],
        ], 200);
    }
}