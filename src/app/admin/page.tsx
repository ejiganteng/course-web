'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash, FiPlus, FiSearch } from 'react-icons/fi';
import AdminNav from '@/components/admin/navbar';
import AdminHeader from '@/components/admin/header';
import { toast } from 'react-toastify';

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
  password_confirmation: string;
  role: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ 
    name: '', 
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 401) {
        window.location.href = '/auth';
        return;
      }

      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.password !== form.password_confirmation) {
        toast.error('Konfirmasi password tidak sesuai');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan pengguna');
      }

      await fetchUsers();
      setShowAddModal(false);
      toast.success('Pengguna berhasil ditambahkan');
      setForm({ 
        name: '', 
        email: '', 
        password: '', 
        password_confirmation: '',
        role: 'user'
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui pengguna');
      }

      await fetchUsers();
      setShowEditModal(false);
      toast.success('Pengguna berhasil diperbarui');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus pengguna');
      }

      await fetchUsers();
      toast.success('Pengguna berhasil dihapus');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  return (
    <div className="flex">
      <AdminNav />
      
      <div className="flex-1 ml-64 mt-16 p-8">
        <AdminHeader />
        
        <main className="p-8 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => {
                setForm({ 
                  name: '', 
                  email: '', 
                  password: '', 
                  password_confirmation: '',
                  role: 'user'
                });
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Tambah Pengguna
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto"
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Nama</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Tanggal Daftar</th>
                    <th className="px-6 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex space-x-4">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setForm({ 
                              name: user.name, 
                              email: user.email,
                              password: '',
                              password_confirmation: '',
                              role: user.role
                            });
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </main>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Tambah Pengguna</h3>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama"
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <select
                    className="w-full p-2 border rounded"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="instruktur">Instruktur</option>
                  </select>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Konfirmasi Password"
                    className="w-full p-2 border rounded"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Edit Pengguna</h3>
              <form onSubmit={handleEditUser}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama"
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <select
                    className="w-full p-2 border rounded"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="instruktur">Instruktur</option>
                  </select>
                  <input
                    type="password"
                    placeholder="Password (Biarkan kosong jika tidak diubah)"
                    className="w-full p-2 border rounded"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}