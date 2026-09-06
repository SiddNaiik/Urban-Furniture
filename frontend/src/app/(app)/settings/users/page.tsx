"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import UserForm, { type CreateUserData } from "@/features/users/components/UserForm";
import UserList from "@/features/users/components/UserList";

import { getUsers, createUser } from "@/lib/api";
import type { User } from "@/types/user";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    const newUser = await createUser(data);
    setUsers((currentUsers) => [...currentUsers, newUser]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#737373]">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 flex items-center gap-2 text-sm text-[#737373] hover:text-[#2C2C2C]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <p className="text-sm text-[#737373]">
            Settings
          </p>

          <h1 className="text-2xl font-semibold text-[#2C2C2C]">
            User Management
          </h1>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[#6B705C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#5c604f]"
          >
            <Plus size={18} />
            Add User
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm ? (
        <UserForm
          onSave={handleCreateUser}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
}