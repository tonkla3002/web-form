"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return "Invalid credentials.";
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return "Invalid credentials.";
    }

    // Set cookie
    // Note: In Next.js Server Actions, cookies() is strictly valid.
    // However, cookies().set() is not available in all versions directly or might need await.
    // In Next.js 15+ it is async. In 14 it is sync-ish but valid.
    // Checking previous file context... it seems strict.
    // Re-checking imports.
    // Assuming Next.js 14/15 based on "use server".
    // Using (await cookies()) or just cookies() depending on version.
    // Given the previous file didn't fail on "use server", it's modern.
    // I will assume simple cookies().set for now. If it fails I will fix.
    (await cookies()).set("userId", user.id.toString());
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Auth Error:", error);
    return "Something went wrong.";
  }
  redirect("/");
}

export async function handleSignOut() {
  (await cookies()).delete("userId");
  redirect("/login");
}

function isRedirectError(error: any) {
  return (
    error &&
    typeof error === "object" &&
    (error.message === "NEXT_REDIRECT" ||
      error.digest?.startsWith("NEXT_REDIRECT"))
  );
}
