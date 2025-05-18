"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  FiUser,
  FiLock,
  FiMail,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { loginUser, registerUser, getRedirectPath } from "@/utils/auth-utils";

interface AuthResponse {
  message: string;
  data: {
    token: string;
    role: string;
    user_id: number;
  };
}

type FormInput = {
  id: string;
  name: keyof typeof defaultFormData;
  type: string;
  placeholder: string;
  icon: any;
  show: "both" | "register";
  animate?: boolean;
};

const defaultFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const formInputs: FormInput[] = [
  {
    id: "name",
    name: "name",
    type: "text",
    placeholder: "Nama Lengkap",
    icon: FiUser,
    show: "register",
    animate: true,
  },
  {
    id: "email",
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: FiMail,
    show: "both",
  },
  {
    id: "password",
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: FiLock,
    show: "both",
  },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    placeholder: "Konfirmasi Password",
    icon: FiLock,
    show: "register",
    animate: true,
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Clear auth data jika sudah login
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      const role = localStorage.getItem("role");
      if (role) {
        router.push(getRedirectPath(role));
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const response = await loginUser(formData.email, formData.password);

        // Redirect based on role
        router.push(getRedirectPath(response.data.role));
      } else {
        // Handle registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Password tidak sama");
        }

        await registerUser(
          formData.name,
          formData.email,
          formData.password,
          formData.confirmPassword
        );

        // After successful registration, login automatically
        const loginResponse = await loginUser(
          formData.email,
          formData.password
        );

        // Redirect based on role
        router.push(getRedirectPath(loginResponse.data.role));
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderInput = (input: FormInput) => {
    const shouldShow = input.show === "both" || !isLogin;
    if (!shouldShow) return null;

    return (
      <motion.div
        key={input.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <input.icon className="absolute top-4 left-4 text-gray-400" />
        <input
          type={input.type}
          name={input.name}
          placeholder={input.placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-800 focus:border-purple-500 focus:outline-none text-white"
          value={formData[input.name]}
          onChange={handleChange}
          required={input.show === "register" ? !isLogin : true}
        />
      </motion.div>
    );
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 relative"
        >
          <Link
            href="/"
            className="flex items-center gap-2 absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="text-lg" />
          </Link>

          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Masuk Akun" : "Daftar Akun"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm text-center p-3 bg-red-900/20 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {formInputs.map(renderInput)}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>
                  {isLogin ? "Masuk Sekarang" : "Daftar Sekarang"}
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </motion.button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400">atau</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors text-gray-300"
              >
                <FaGoogle className="text-red-400" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors text-gray-300"
              >
                <FaFacebook className="text-blue-400" />
                <span className="text-sm">Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-400">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-400 hover:text-purple-300 font-bold"
              >
                {isLogin ? "Daftar disini" : "Masuk disini"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
