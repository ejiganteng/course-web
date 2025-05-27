"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiTag, FiFolder } from "react-icons/fi";
import { toast } from "react-toastify";

interface Category {
  id: string;
  name: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Gagal memuat kategori");

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      handleError(error, "Gagal memuat kategori");
    }
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    let message = defaultMessage;
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }
    toast.error(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = selectedCategory
        ? `http://localhost:8000/api/categories/${selectedCategory.id}`
        : "http://localhost:8000/api/categories";

      const method = selectedCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error(responseData.errors.name[0]);
        }
        throw new Error(responseData.message || "Operasi gagal");
      }

      toast.success(responseData.message);
      setIsModalOpen(false);
      setFormData({ name: "" });
      fetchCategories();
    } catch (error) {
      handleError(error, "Terjadi kesalahan saat memproses permintaan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/api/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (!response.ok)
          throw new Error(responseData.message || "Gagal menghapus kategori");

        toast.success(responseData.message);
        fetchCategories();
      } catch (error) {
        handleError(error, "Gagal menghapus kategori");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-auto pt-20 lg:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg flex-shrink-0">
                <FiTag className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Manajemen Kategori
                </h1>
                <p className="text-slate-600 text-sm lg:text-base">
                  Kelola kategori kursus dengan mudah
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(null);
                setFormData({ name: "" });
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 lg:px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-300 text-sm w-full sm:w-auto"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Kategori</span>
              <span className="sm:hidden">Tambah</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-4 lg:p-6 border-b border-slate-200/50 bg-gradient-to-r from-white/50 to-purple-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiFolder className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 mr-2" />
                <span className="font-semibold text-slate-700 text-sm lg:text-base">
                  Daftar Kategori
                </span>
              </div>
              <span className="text-xs lg:text-sm text-slate-500">
                {categories.length} kategori
              </span>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-4 lg:p-6">
            {categories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 lg:py-16"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTag className="w-8 h-8 lg:w-10 lg:h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Belum ada kategori
                </h3>
                <p className="text-slate-500 mb-6 text-sm lg:text-base">
                  Mulai dengan menambahkan kategori pertama Anda
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setFormData({ name: "" });
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 lg:px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm"
                >
                  Tambah Kategori Pertama
                </button>
              </motion.div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead className="bg-gradient-to-r from-slate-50 to-purple-50/30">
                      <tr>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs lg:text-sm font-semibold text-slate-700">
                          <div className="flex items-center">
                            <FiTag className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-purple-600" />
                            Nama Kategori
                          </div>
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-right text-xs lg:text-sm font-semibold text-slate-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <AnimatePresence>
                        {categories.map((category, index) => (
                          <motion.tr
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-purple-50/50 transition-colors duration-200 group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                                  <FiTag className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                                    {category.name}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    ID: {category.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setFormData({ name: category.name });
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit kategori"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(category.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Hapus kategori"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div
                  className={`p-4 lg:p-6 text-white ${
                    selectedCategory
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                      : "bg-gradient-to-r from-purple-600 to-pink-600"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center mr-2 lg:mr-3 flex-shrink-0">
                      <FiTag className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg lg:text-xl font-bold truncate">
                        {selectedCategory
                          ? "Edit Kategori"
                          : "Buat Kategori Baru"}
                      </h2>
                      <p className="text-xs lg:text-sm opacity-90 truncate">
                        {selectedCategory
                          ? "Perbarui informasi kategori"
                          : "Tambahkan kategori kursus baru"}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 lg:p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      placeholder="Contoh: Programming, Design, Marketing"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-800 transition-all duration-300 text-sm"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm order-2 sm:order-1"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-4 py-3 text-white rounded-xl font-medium shadow-lg transition-all duration-300 text-sm order-1 sm:order-2 ${
                        selectedCategory
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Menyimpan...
                        </div>
                      ) : selectedCategory ? (
                        "Perbarui"
                      ) : (
                        "Simpan"
                      )}
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
