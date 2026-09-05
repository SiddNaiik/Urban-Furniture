"use client";

import { useState } from "react";

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type UserFormProps = {
  onSave: (data: CreateUserData) => Promise<void>;
  onCancel: () => void;
};

export default function UserForm({
  onSave,
  onCancel,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // Name validation
    if (!name.trim()) {
      setError("Please enter the user's name.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Please enter the user's email.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter a temporary password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await onSave({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#2C2C2C]">
          Add User
        </h2>

        <p className="mt-1 text-sm text-[#737373]">
          Create a new user and assign their role.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="user-name"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Full Name
          </label>

          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#2C2C2C] outline-none transition focus:border-[#6B705C] focus:ring-1 focus:ring-[#6B705C]"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="user-email"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Email
          </label>

          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#2C2C2C] outline-none transition focus:border-[#6B705C] focus:ring-1 focus:ring-[#6B705C]"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="user-password"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Temporary Password
          </label>

          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#2C2C2C] outline-none transition focus:border-[#6B705C] focus:ring-1 focus:ring-[#6B705C]"
          />

          <p className="mt-1.5 text-xs text-[#737373]">
            The user can change this password later.
          </p>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="user-role"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            User Role
          </label>

          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#2C2C2C] outline-none transition focus:border-[#6B705C] focus:ring-1 focus:ring-[#6B705C]"
          >
            <option value="staff">
              Staff
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#6B705C] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5c604f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Create User"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#2C2C2C] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}