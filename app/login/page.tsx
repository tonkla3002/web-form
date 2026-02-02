"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import Link from "next/link";
import { Leaf } from "lucide-react";
// We need to use `signIn` from `next-auth/react` for client side,
// usually handled via server actions in v5 but client SDK works too if configured.
// For simplicity in v5 without server actions, we'll try a standard form submission or use a server action wrapper.
// Actually, standard practice in v5 is server actions. Let's create a server action for login later or
// use a simple API route approach if needed. For now let's use a server action wrapper in a separate file if possible,
// OR simpler: use `signIn` from `next-auth/react`?
// Wait, `next-auth/react` is still compatible. But let's build a server action for cleanliness?
// No, let's stick to the simplest flow: a client form calling a Server Action.

// Actually, let's keep it simple: Create a server action file `app/lib/actions.ts`?
// Or just use the NextAuth `signIn` method if available client-side?
// In v5, `signIn` can be imported from `next-auth/react`.
// However, we need to make sure we have a SessionProvider or similar if we use hooks.
// Let's use a Server Action directly in this file? No, client components can't define server actions directly inline easily without issues sometimes.
// Let's create `app/lib/actions.ts` for clean login.

import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const result = await authenticate(undefined, formData);
      if (typeof result === "string") {
        setErrorMessage(result);
        setLoading(false);
      } else {
        // Redirect usually happens, so this might not be reached if redirect is immediate
        // unlikely to be reached if redirect works.
      }
    } catch (e: any) {
      // Check if error is a Next.js redirect error (NEXT_REDIRECT)
      if (
        e.message === "NEXT_REDIRECT" ||
        e.digest?.startsWith("NEXT_REDIRECT")
      ) {
        // Do nothing, let redirect happen
        return;
      }
      setErrorMessage("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Leaf size={32} className="text-green-600" />
      </div>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          เข้าสู่ระบบ
        </h1>
        {errorMessage && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 rounded-2xl shadow-lg transition-colors mt-2"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="text-green-600 font-medium hover:underline"
          >
            ลงทะเบียน
          </Link>
        </p>
      </div>
    </div>
  );
}
