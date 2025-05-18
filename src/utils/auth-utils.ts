// auth-utils.ts
import { toast } from "react-toastify";

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    role: string;
    user_id: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Login function that authenticates user with Laravel API
 * @param email User email
 * @param password User password
 * @returns AuthResponse with token, role and user_id
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login gagal");
    }

    // Store auth data in localStorage
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user_id", data.data.user_id.toString());
    localStorage.setItem("role", data.data.role);

    toast.success("Login berhasil");
    return data;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    throw error;
  }
};

/**
 * Register function that creates new user via Laravel API
 * @param name User name
 * @param email User email
 * @param password User password
 * @param password_confirmation Password confirmation
 * @returns AuthResponse
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registrasi gagal");
    }

    toast.success("Registrasi berhasil");
    return data;
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

/**
 * Get user role from localStorage
 * @returns user role or null
 */
export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};

/**
 * Get user ID from localStorage
 * @returns user ID or null
 */
export const getUserId = (): number | null => {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem("user_id");
  return id ? parseInt(id) : null;
};

/**
 * Get redirect path based on user role
 * @param role User role
 * @returns path to redirect user to
 */
export const getRedirectPath = (role: string): string => {
  switch(role) {
    case "admin":
      return "/admin";
    case "instruktur":
      return "/instruktur";
    default:
      return "/dashboard";
  }
};