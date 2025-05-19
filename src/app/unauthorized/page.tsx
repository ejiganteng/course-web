'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          403 - Akses Ditolak
        </h1>
        <p className="text-gray-600">
          Anda tidak memiliki izin untuk mengakses halaman ini
        </p>
        <p className="text-gray-500 text-sm mt-4">
          Akan dialihkan kembali dalam 3 detik...
        </p>
      </div>
    </div>
  );
}