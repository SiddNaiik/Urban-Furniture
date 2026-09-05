'use client';
import Link from 'next/link';
import { useState } from 'react';
export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('accountant');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    /*
      Future backend integration:
      const response = await authApi.signup({
        name,
        email,
        role,
        password,
      });
      After successful signup:
      router.push('/login');
    */
    console.log({
      name,
      email,
      role,
      password,
    });
  };
  return (
    <div className="w-full">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-7">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#2C2C2C]">
          Create your account
          <span className="ml-1 text-[#6B705C]">✦</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Set up your Urban Furniture accounting account and get started.
        </p>
      </div>
      {/* =====================================================
          LOGIN / CREATE USER TABS
      ===================================================== */}
      <div className="mb-6 grid grid-cols-2 rounded-xl border border-[#E3E0D8] bg-white p-1">
        <Link
          href="/login"
          className="flex h-10 items-center justify-center rounded-lg text-sm font-medium text-[#737373] transition hover:bg-[#F8F6F1] hover:text-[#2C2C2C]"
        >
          Log In
        </Link>
        <div className="flex h-10 items-center justify-center rounded-lg bg-[#6B705C] text-sm font-medium text-white shadow-sm">
          Create User
        </div>
      </div>
      {/* =====================================================
          FORM
      ===================================================== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="h-11 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/10"
          />
        </div>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/10"
          />
        </div>
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            User Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 text-sm text-[#2C2C2C] outline-none transition focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/10"
          >
            <option value="accountant">
              Invoicing User — Accountant
            </option>
            <option value="admin">
              Admin — Business Owner
            </option>
          </select>
        </div>
        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="h-11 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 pr-11 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2C2C2C]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
        </div>
        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-[#2C2C2C]"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="h-11 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 pr-11 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-2 focus:ring-[#6B705C]/10"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2C2C2C]"
              aria-label={
                showConfirmPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
        </div>
        {/* =====================================================
            FORGOT PASSWORD
        ===================================================== */}
        <div className="flex justify-end pt-1">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#6B705C] transition hover:text-[#4F5444] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {/* =====================================================
            BUTTONS
        ===================================================== */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Create User */}
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#6B705C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5B604F] focus:outline-none focus:ring-2 focus:ring-[#6B705C]/20"
          >
            Create User
          </button>
          {/* Cancel */}
          <Link
            href="/login"
            className="flex h-11 items-center justify-center rounded-xl border border-[#DCD9D0] bg-white px-5 text-sm font-semibold text-[#2C2C2C] transition hover:bg-[#F8F6F1]"
          >
            Cancel
          </Link>
        </div>
      </form>
      {/* =====================================================
          BOTTOM LOGIN LINK
      ===================================================== */}
      <p className="mt-7 text-center text-sm text-[#737373]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#6B705C] hover:underline"
        >
          Log In →
        </Link>
      </p>
    </div>
  );
}
/* =========================================================
   EYE ICON
========================================================= */
function EyeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17.5 17.5 0 0 1-3.2 3.9" />
      <path d="M6.2 6.3C3.7 8 2.5 12 2.5 12a17.6 17.6 0 0 0 5.1 4.8A10.5 10.5 0 0 0 12 19c1.5 0 2.8-.3 4-.8" />
    </svg>
  );
}