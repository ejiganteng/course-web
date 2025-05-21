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
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }

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
      throw new Error(data.message || "Login gagal, periksa email dan password Anda");
    }

    // Make sure all required fields are present
    if (!data.data || !data.data.token || !data.data.role || data.data.user_id === undefined) {
      throw new Error("Format response tidak valid");
    }

    // Store auth data in localStorage
    setAuthData({
      token: data.data.token,
      user_id: data.data.user_id,
      role: data.data.role
    });

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
    // Validate inputs
    if (!name || !email || !password || !password_confirmation) {
      throw new Error("Semua field harus diisi");
    }

    if (password !== password_confirmation) {
      throw new Error("Password dan konfirmasi password tidak sama");
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        password_confirmation 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        throw new Error(errorMessages[0] as string || "Registrasi gagal");
      }
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
 * Logout function that invalidates the current token
 * @returns Promise<void>
 */
export const logoutUser = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Tidak ada sesi yang aktif");
    }
    
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Logout gagal");
    }

    // Clear auth data from localStorage
    clearAuthData();
    toast.success("Logout berhasil");
  } catch (error) {
    const err = error as Error;
    toast.error(err.message);
    // Clear localStorage anyway in case of network errors
    clearAuthData();
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
 * Set auth data to localStorage with consistent implementation
 * @param data Auth data including token, user_id and role
 */
export const setAuthData = (data: { token: string, user_id: number, role: string }): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("token", data.token);
  localStorage.setItem("user_id", data.user_id.toString());
  localStorage.setItem("role", data.role);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("role");
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
      return "/user";
  }
};

/**
 * Get authentication headers for API requests
 * @returns Headers object with Authorization token
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Create a protected fetch function that includes auth token
 * @param url API endpoint
 * @param options Fetch options
 * @returns Response from API
 */
export const protectedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (!isAuthenticated()) {
    throw new Error("User not authenticated");
  }
  
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};