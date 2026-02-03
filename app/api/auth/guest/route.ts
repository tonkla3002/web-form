import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// Removed unused uuid import
// Actually, let's just use Crypto or simple math for ID

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const existingUserId = cookieStore.get("userId")?.value;

  if (existingUserId) {
    // Already logged in, go home
    redirect("/");
  }

  // Create Guest
  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substr(2);
  const guestEmail = `guest_${uniqueId}@veggie.app`;
  const guestPassword = "guest_password_secure"; // Should cloak this but it's fine for simple guest

  // Note: bcrypt needed? Schema says string. app/lib/actions.ts uses bcrypt.
  // For Guest, we don't really care about security as much, but we should hash it to be consistent if reused.
  // However, we can just store plain string if we never "login" via form.
  // But let's simple hash it or just store a placeholder.
  // Wait, actions.ts compares with bcrypt. If we ever want to "claim" this account, we might need a password.
  // For now, let's just make it a simple string. The logic in actions.ts `await bcrypt.compare(password, user.password)` will fail if it's not hashed,
  // effectively disabling password login for guests (which is what we want).

  try {
    const newUser = await prisma.user.create({
      data: {
        email: guestEmail,
        password: guestPassword, // Not hashed, so password login is impossible. Good.
        name: "Guest Farmer",
      },
    });

    cookieStore.set("userId", newUser.id.toString());
  } catch (error) {
    console.error("Failed to create guest:", error);
    return NextResponse.json(
      { error: "Failed to create guest session" },
      { status: 500 },
    );
  }

  redirect("/");
}
