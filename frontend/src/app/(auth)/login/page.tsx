"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  /* 
     LOGIN
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const email = formData.email.trim();
    const password = formData.password;
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    /*
      FUTURE BACKEND INTEGRATION:
      const response = await authApi.login({
        email,
        password,
      });
      if (!response.success) {
        setError(response.message);
        return;
      }
      auth.setToken(response.token);
    */
    // Temporary frontend login
    console.log("Login:", {
      email,
      password,
      rememberMe,
    });
    // Successful login → Dashboard
    router.push("/dashboard");
  };
  return (
    <div className="w-full">
      {/* 
          HEADER
       */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-[-0.035em] text-[#2C2C2C]">
            Welcome back
          </h1>
        </div>
        <p className="mt-3 text-base leading-6 text-[#737373]">
          Sign in to your Urban Furniture account
        </p>
      </div>
      {/* 
          LOGIN / Sign Up SWITCH
       */}
      <div className="rounded-2xl border border-[#E5E1D9] bg-white p-1.5 shadow-[0_12px_40px_rgba(44,44,44,0.05)]">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F8F6F1] p-1">
          {/* Login */}
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-lg bg-white text-base font-semibold text-[#2C2C2C] shadow-sm"
          >
            Log In
          </Link>
          {/* Sign Up */}
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center rounded-lg text-base font-medium text-[#737373] transition hover:text-[#2C2C2C]"
          >
            Sign Up
          </Link>
        </div>
      </div>
      {/* 
          LOGIN FORM
       */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        {/* ===================================================
            EMAIL
        =================================================== */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-base font-semibold text-[#2C2C2C]"
          >
            Email
          </label>
          <div className="relative">
            {/* Email Icon */}
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#858585]">
              <EmailIcon />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  email: event.target.value,
                })
              }
              placeholder="Enter your email"
              className="h-14 w-full rounded-xl border border-[#DCD8D0] bg-white pl-12 pr-4 text-base text-[#2C2C2C] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#6B705C] focus:ring-4 focus:ring-[#6B705C]/10"
            />
          </div>
        </div>
        {/* ===================================================
            PASSWORD
        =================================================== */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-base font-semibold text-[#2C2C2C]"
            >
              Password
            </label>
            {/* Forgot Password */}
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#6B705C] transition hover:text-[#4F5545] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            {/* Lock Icon */}
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#858585]">
              <LockIcon />
            </div>
            {/* Password Input */}
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  password: event.target.value,
                })
              }
              placeholder="Enter your password"
              className="h-14 w-full rounded-xl border border-[#DCD8D0] bg-white pl-12 pr-12 text-base text-[#2C2C2C] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#6B705C] focus:ring-4 focus:ring-[#6B705C]/10"
            />
            {/* Show / Hide Password */}
            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858585] transition hover:text-[#2C2C2C]"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
        </div>
        {/* ===================================================
            ERROR
        =================================================== */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {/* ===================================================
            REMEMBER ME
        =================================================== */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
            className="h-4 w-4 rounded border-[#CFCBC3] accent-[#6B705C]"
          />
          <span className="text-sm font-medium text-[#737373]">
            Remember me
          </span>
        </label>
        {/* ===================================================
            LOGIN BUTTON
        =================================================== */}
        <button
          type="submit"
          className="h-14 w-full rounded-xl bg-[#6B705C] text-base font-semibold text-white shadow-sm transition hover:bg-[#59604E] focus:outline-none focus:ring-4 focus:ring-[#6B705C]/20 active:scale-[0.99]"
        >
          Log In
        </button>
      </form>
      {/* 
          Sign Up
       */}
      <div className="mt-8 border-t border-[#E7E3DB] pt-7">
        <p className="text-center text-base text-[#737373]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#6B705C] transition hover:text-[#4F5545]"
          >
            Sign Up
          </Link>
          <span className="ml-2 text-[#6B705C]">
            →
          </span>
        </p>
      </div>
    </div>
  );
}
function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M2.5 12C3.5 9 7 5 12 5C17 5 20.5 9 21.5 12C20.5 15 17 19 12 19C7 19 3.5 15 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6A2 2 0 0013.4 13.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.2A10.8 10.8 0 0112 5C17 5 20.5 9 21.5 12C21 13.5 19.8 15.3 18 16.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.1 6.2A11.5 11.5 0 002.5 12C3.5 15 7 19 12 19C13.3 19 14.5 18.7 15.6 18.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}