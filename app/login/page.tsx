"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type LoginState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginState>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const isDisabled = useMemo(
    () => !form.email.trim() || !form.password.trim() || isSubmitting,
    [form.email, form.password, isSubmitting],
  );

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.BASE_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "Unable to login. Please try again.",
        );
      }

      setMessage(payload?.message || "Login successful.");
      setForm({ email: "", password: "" });
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-[440px] rounded-[28px] bg-white px-8 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:px-10 sm:py-12 border border-slate-100">
        <div className="text-center">
          <h1 className="text-[32px] font-bold tracking-tight text-[#0f172a]">
            Welcome Back
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Login to continue your journey
          </p>
        </div>

        <form action={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="h-[52px] w-full rounded-full border border-slate-200 bg-transparent px-5 text-[15px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 transition-colors"
            placeholder="Email Address"
          />

          <input
            type="password"
            required
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="h-[52px] w-full rounded-full border border-slate-200 bg-transparent px-5 text-[15px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-400 transition-colors"
            placeholder="Password"
          />

          <button
            type="submit"
            disabled={isDisabled}
            className="h-[52px] cursor-pointer w-full rounded-full bg-[#1a9d37] text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#2c9720] disabled:cursor-not-allowed disabled:opacity-60 mt-2"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {message ? (
          <p
            className={`mt-4 rounded-xl px-4 py-2.5 text-center text-sm ${
              isError
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-100" />
            <span className="text-[13px] text-slate-400 font-medium">
              New here?
            </span>
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          <p className="mt-6 text-center text-[14px] text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-slate-900 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
