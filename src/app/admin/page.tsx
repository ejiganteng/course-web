"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit,
  FiTrash,
  FiPlus,
  FiSearch,
  FiUsers,
  FiEye,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }

      const data = await response.json();
      if (data && data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.password !== form.password_confirmation) {
        toast.error("Konfirmasi password tidak sesuai");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan pengguna");
      }

      await fetchUsers();
      setShowAddModal(false);
      toast.success("Pengguna berhasil ditambahkan");
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui pengguna");
      }

      await fetchUsers();
      setShowEditModal(false);
      toast.success("Pengguna berhasil diperbarui");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus pengguna");
      }

      await fetchUsers();
      toast.success("Pengguna berhasil dihapus");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "from-red-500 to-pink-500";
      case "instruktur":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-emerald-500 to-teal-500";
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200";
      case "instruktur":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200";
      default:
        return "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manajemen Pengguna
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">
                Kelola semua pengguna sistem dengan mudah
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-4 lg:p-6 border-b border-slate-200/50 bg-gradient-to-r from-white/50 to-blue-50/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  className="w-full pl-10 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                    role: "user",
                  });
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 lg:px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-300 text-sm w-full sm:w-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Pengguna</span>
                <span className="sm:hidden">Tambah</span>
              </motion.button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-4 lg:p-6">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 text-lg">
                  Memuat data pengguna...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="overflow-x-auto -mx-4 lg:mx-0"
              >
                <div className="min-w-full inline-block align-middle">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-slate-700">
                          ID
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-slate-700">
                          Pengguna
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-slate-700 hidden sm:table-cell">
                          Role
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-slate-700 hidden md:table-cell">
                          Tanggal Daftar
                        </th>
                        <th className="px-3 lg:px-6 py-4 text-center text-xs lg:text-sm font-semibold text-slate-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user, index) => (
                            <motion.tr
                              key={user.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-blue-50/50 transition-colors duration-200 group"
                            >
                              <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                #{user.id}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRoleColor(
                                      user.role
                                    )} flex items-center justify-center text-white font-semibold text-sm mr-3 shadow-md`}
                                  >
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-800">
                                      {user.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeStyle(
                                    user.role
                                  )}`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(user.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setForm({
                                        name: user.name,
                                        email: user.email,
                                        password: "",
                                        role: user.role,
                                      });
                                      setShowEditModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Edit pengguna"
                                  >
                                    <FiEdit className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Hapus pengguna"
                                  >
                                    <FiTrash className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center">
                                <FiUsers className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-slate-500 text-lg font-medium">
                                  Tidak ada pengguna ditemukan
                                </p>
                                <p className="text-slate-400 text-sm">
                                  Coba ubah kata kunci pencarian
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 lg:p-6 text-white">
                  <h3 className="text-lg lg:text-xl font-bold">
                    Tambah Pengguna Baru
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Lengkapi informasi pengguna
                  </p>
                </div>

                <form onSubmit={handleAddUser} className="p-4 lg:p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="instruktur">Instruktur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      placeholder="Ulangi password"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.password_confirmation}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password_confirmation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit User Modal */}
        <AnimatePresence>
          {showEditModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <h3 className="text-xl font-bold">Edit Pengguna</h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    {selectedUser.name}
                  </p>
                </div>

                <form onSubmit={handleEditUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="instruktur">Instruktur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Kosongkan jika tidak ingin mengubah"
                      className="w-full pl-3 py-2 rounded-xl border-3 border-gray-200 bg-white focus:border-gray-500 focus:outline-none text-gray-400"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Biarkan kosong jika tidak ingin mengubah password
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
