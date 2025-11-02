"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "../actions/auth.action";

export default function SignupPage() {
  const [errorMessage, formAction, isPending] = useActionState(register, undefined);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-900">Create Account</h1>

        <form className="space-y-5" action={formAction}>
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              required
              className="peer w-full rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-black focus:ring-0"
              placeholder="Email address"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-black"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength={8}
              className="peer w-full rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-black focus:ring-0"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2.5 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-black"
            >
              Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md disabled:cursor-not-allowed bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:ring-2 focus:ring-black disabled:opacity-30 focus:ring-offset-2"
            disabled={isPending}
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-blue-400 hover:text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
        {errorMessage && <p className="text-red-500 m-3">{errorMessage}</p>}
      </div>
    </div>
  );
}
