"use client";

import { useState } from 'react';
import { FiUser, FiLock, FiMail, FiBook, FiChevronLeft } from 'react-icons/fi';

// Komponen Layout Umum
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
    {/* Branding Section */}
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 text-white p-8">
      <FiBook className="w-20 h-20 mb-4" />
      <h1 className="text-4xl font-bold mb-2">E-Learning</h1>
      <p className="text-lg text-center">Belajar tanpa batas, sukses tanpa akhir</p>
    </div>

    {/* Form Section */}
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

// Komponen Input Umum
const InputField = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  name,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}) => (
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
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    console.log(form);
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan pembelajaran"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
        >
          Masuk
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
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    console.log(form);
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Mulai perjalanan belajarmu sekarang"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<FiUser />}
          type="text"
          placeholder="Nama Lengkap"
          value={form.name}
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
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
        >
          Daftar
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