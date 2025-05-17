<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsInstruktur
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'instruktur') {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized. Instruktur only.'], 403);
    }
}
