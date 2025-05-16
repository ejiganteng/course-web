"use client";

import { useState, FormEvent } from 'react';
import { FiUser, FiLock, FiMail, FiBook } from 'react-icons/fi';

interface AuthResponse {
  message: string;
  data: {
    token: string;
    user_id?: number;
  };
}

interface UserForm {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Komponen Layout
const AuthLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-8">
      <FiBook className="w-20 h-20 mb-4" />
      <h1 className="text-4xl font-bold mb-2">E-Learning</h1>
      <p className="text-lg text-center">Belajar tanpa batas, sukses tanpa akhir</p>
    </div>

    <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>
        
        <div className="bg-white p-8 shadow rounded-lg">
          {children}
        </div>
      </div>
    </div>
  </div>
);

interface InputFieldProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const InputField = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  name
}: InputFieldProps) => (
  <div className="relative mb-4">
    <div className="absolute top-3 left-3 text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  </div>
);

// Komponen Login
const Login = ({ switchView }: { switchView: () => void }) => {
  const [form, setForm] = useState<Omit<UserForm, 'name' | 'confirmPassword'>>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      localStorage.setItem('token', data.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan pembelajaran"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <InputField
          icon={<FiMail />}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        
        <InputField
          icon={<FiLock />}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <button
            type="button"
            onClick={switchView}
            className="text-blue-600 hover:underline font-medium"
          >
            Daftar disini
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

// Komponen Register
const Register = ({ switchView }: { switchView: () => void }) => {
  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (form.password !== form.confirmPassword) {
        throw new Error('Password dan konfirmasi password tidak sama');
      }

      // Registrasi
      const registerResponse = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registrasi gagal');
      }

      // Auto login
      const loginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const loginData: AuthResponse = await loginResponse.json();
      
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Auto login gagal');
      }

      localStorage.setItem('token', loginData.data.token);
      window.location.href = '/auth';
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Mulai perjalanan belajarmu sekarang"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <InputField
          icon={<FiUser />}
          type="text"
          placeholder="Nama Lengkap"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        
        <InputField
          icon={<FiMail />}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        
        <InputField
          icon={<FiLock />}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        
        <InputField
          icon={<FiLock />}
          type="password"
          placeholder="Konfirmasi Password"
          value={form.confirmPassword || ''}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Mendaftarkan...' : 'Daftar'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={switchView}
            className="text-blue-600 hover:underline font-medium"
          >
            Masuk disini
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

// Komponen Utama
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login switchView={() => setIsLogin(false)} />
      ) : (
        <Register switchView={() => setIsLogin(true)} />
      )}
    </>
  );
}