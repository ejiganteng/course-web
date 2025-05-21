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
    public function upload(PdfRequest $request, $id)
    {

        $savedPdfs = [];

        foreach ($request->pdfs as $pdfData) {
            $file = $pdfData['file'];
            $originalName = str_replace(' ', '-', $file->getClientOriginalName());
            $fileName = time() . '-' . uniqid() . '-' . $originalName;
            $path = $file->storeAs('public/course_pdfs', $fileName);

            $pdf = Pdf::create([
                'course_id' => $id,
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

    public function downloadById($id)
    {
        $pdf = Pdf::findOrFail($id);

        if(!Storage::exists($pdf->file_path)){
            return response()->json([
                "message" => "File tidak ditemukan"
            ], 404);
        }

        return Storage::download($pdf->file_path, $pdf->title . '.pdf');
    }

    public function destroy($id)
    {
        $pdf = Pdf::findOrFail($id);

        // Cek apakah file nya terdapat di storage
        if(Storage::exists($pdf->file_path)){
            Storage::delete($pdf->file_path);
        }

        $pdf->delete();

        return response()->json([
            "message" => "PDF Berhasil dihapus"
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $pdf = Pdf::findOrFail($id);
        
        $request->validate([
            'title' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
            'file' => 'nullable|file|mimes:pdf|max:10240', // max 10MB
        ]);

        // Update title dan order_index jika ada
        if ($request->has('title')) {
            $pdf->title = $request->title;
        }

        if ($request->has('order_index')) {
            $pdf->order_index = $request->order_index;
        }

        // Jika user upload file baru
        if ($request->hasFile('file')) {
            // Hapus file lama
            if (Storage::exists($pdf->file_path)) {
                Storage::delete($pdf->file_path);
            }

            // Simpan file baru
            $file = $request->file('file');
            $originalName = str_replace(' ', '-', $file->getClientOriginalName());
            $fileName = time() . '-' . uniqid() . '-' . $originalName;
            $path = $file->storeAs('public/course_pdfs', $fileName);

            // Update path di database
            $pdf->file_path = $path;
        }

        $pdf->save();

        return response()->json([
            'message' => 'PDF berhasil diperbarui',
            'pdf' => [
                'id' => $pdf->id,
                'title' => $pdf->title,
                'url' => asset(str_replace('public/', 'storage/', $pdf->file_path)),
                'order_index' => $pdf->order_index
            ]
        ]);
    }


}
