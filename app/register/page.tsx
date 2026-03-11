"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type RegisterState = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterState>({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const isDisabled = useMemo(
    () => !form.name.trim() || !form.email.trim() || !form.password.trim() || isSubmitting,
    [form.name, form.email, form.password, isSubmitting],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "Player",
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to register. Please try again.");
      }

      setMessage(payload?.message || "Registration successful.");
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white px-8 py-10 shadow-[0_18px_48px_rgba(15,23,42,0.12)] sm:px-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p className="mt-3 text-xl text-slate-500">Sign up to book your next turf</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="h-16 w-full rounded-full border border-slate-300 bg-transparent px-6 text-2xl text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Full Name"
          />

          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="h-16 w-full rounded-full border border-slate-300 bg-transparent px-6 text-2xl text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Email Address"
          />

          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="h-16 w-full rounded-full border border-slate-300 bg-transparent px-6 text-2xl text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
            placeholder="Password"
          />

          <button
            type="submit"
            disabled={isDisabled}
            className="h-16 w-full rounded-full bg-gradient-to-r from-black via-slate-900 to-slate-800 text-2xl font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {message ? (
          <p
            className={`mt-5 rounded-2xl px-4 py-3 text-center text-base ${
              isError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-8">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-2xl">Already a user?</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="mt-5 text-center text-2xl text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-slate-900 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
