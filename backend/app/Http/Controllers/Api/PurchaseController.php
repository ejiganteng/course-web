<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class PurchaseController extends Controller
{
    // Method untuk beli course
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $courseId = $request->input('course_id');

        // Cek apakah user sudah membeli course ini
        $alreadyPurchased = Purchase::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if ($alreadyPurchased) {
            return response()->json([
                'message' => 'You already purchased this course.'
            ], 409); // Conflict
        }

        // Simpan pembelian
        $purchase = Purchase::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'purchased_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Course purchased successfully',
            'purchase' => $purchase,
        ], 201);
    }

    // Method untuk mendapatkan daftar course yang sudah dibeli user
    public function index()
    {
        $user = Auth::user();

        $purchases = $user->purchasedCourses()->with('instructor', 'categories')->get();

        return response()->json([
            'purchases' => $purchases,
        ]);
    }

    // Method untuk membatalkan pembelian (optional)
    public function destroy($id)
    {
        $user = Auth::user();

        $purchase = Purchase::where('user_id', $user->id)
            ->where('course_id', $id)
            ->first();

        if (!$purchase) {
            return response()->json([
                'message' => 'Purchase not found or unauthorized.'
            ], 404);
        }

        $purchase->delete();

        return response()->json([
            'message' => 'Purchase cancelled successfully.'
        ]);
    }
}
