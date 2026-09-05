"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     PASSWORD VALIDATION
  ===================================================== */

  const passwordRules = {
    minLength: password.length > 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.special;

  const isLoginIdValid = loginId.trim().length >= 6 && loginId.trim().length <= 12;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!isLoginIdValid) {
      setError("Login ID must be between 6 and 12 characters.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        login_id: loginId.trim(),
        email: email.trim(),
        password: password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg || "Validation error").join(", "));
      } else {
        setError("Failed to create account. Please check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#2C2C2C]">
          Sign UP your account
          <span className="ml-1 text-[#6B705C]">✦</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#737373]">
          Set up your Urban Furniture accounting account and get started.
        </p>
      </div>

      {/* LOGIN / Sign Up SWITCH */}
      <div className="mb-6 rounded-2xl border border-[#E5E1D9] bg-white p-1.5 shadow-[0_12px_40px_rgba(44,44,44,0.05)]">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F8F6F1] p-1">
          <Link
            href="/login"
            className="flex h-11 items-center justify-center rounded-lg text-sm font-medium text-[#737373] transition hover:text-[#2C2C2C]"
          >
            Log In
          </Link>
          <div className="flex h-11 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#2C2C2C] shadow-sm">
            Sign Up
          </div>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FULL NAME */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="h-12 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-4 focus:ring-[#6B705C]/10"
          />
        </div>

        {/* LOGIN ID */}
        <div>
          <label htmlFor="loginId" className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]">
            Login ID <span className="text-xs font-normal text-[#737373]">(6-12 characters)</span>
          </label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            required
            autoComplete="username"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="e.g. rahul01"
            className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:ring-4 focus:ring-[#6B705C]/10 ${
              loginId.length > 0 && !isLoginIdValid
                ? "border-red-300 focus:border-red-400"
                : "border-[#DCD9D0] focus:border-[#6B705C]"
            }`}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-[#DCD9D0] bg-white px-4 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:border-[#6B705C] focus:ring-4 focus:ring-[#6B705C]/10"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:ring-4 focus:ring-[#6B705C]/10 ${
                password.length > 0 && !isPasswordValid
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#DCD9D0] focus:border-[#6B705C]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858585] transition hover:text-[#2C2C2C]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="mt-2 space-y-1">
            <PasswordRule valid={passwordRules.minLength} text="More than 8 characters" />
            <PasswordRule valid={passwordRules.uppercase} text="At least 1 uppercase letter" />
            <PasswordRule valid={passwordRules.lowercase} text="At least 1 lowercase letter" />
            <PasswordRule valid={passwordRules.special} text="At least 1 special character" />
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-[#2C2C2C]">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm text-[#2C2C2C] outline-none transition placeholder:text-[#A3A09A] focus:ring-4 focus:ring-[#6B705C]/10 ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#DCD9D0] focus:border-[#6B705C]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858585] transition hover:text-[#2C2C2C]"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
              <span>✕</span> Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#6B705C]">
              <span>✓</span> Passwords match
            </p>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-[#6B705C] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#59604E] focus:outline-none focus:ring-4 focus:ring-[#6B705C]/20 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-xl border border-[#DCD9D0] bg-white px-5 text-sm font-semibold text-[#2C2C2C] transition hover:bg-[#F8F6F1]"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* LOGIN LINK */}
      <div className="mt-7 border-t border-[#E7E3DB] pt-6">
        <p className="text-center text-sm text-[#737373]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#6B705C] transition hover:text-[#4F5545] hover:underline">
            Log In
          </Link>
          <span className="ml-2 text-[#6B705C]">→</span>
        </p>
      </div>
    </div>
  );
}

function PasswordRule({ valid, text }: { valid: boolean; text: string }) {
  return (
    <p className={`flex items-center gap-2 text-xs font-medium ${valid ? "text-[#6B705C]" : "text-red-500"}`}>
      <span className="flex h-4 w-4 items-center justify-center text-[11px]">{valid ? "✓" : "✕"}</span>
      {text}
    </p>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M2.5 12C3.5 9 7 5 12 5C17 5 20.5 9 21.5 12C20.5 15 17 19 12 19C7 19 3.5 15 2.5 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.6 10.6A2 2 0 0013.4 13.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.9 5.2A10.8 10.8 0 0112 5C17 5 20.5 9 21.5 12C21 13.5 19.8 15.3 18 16.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.1 6.2A11.5 11.5 0 002.5 12C3.5 15 7 19 12 19C13.3 19 14.5 18.7 15.6 18.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}