import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import VeggieApp from "./components/VeggieApp";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    // Redirect to auto-create guest account instead of login
    redirect("/api/auth/guest");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    // If cookie exists but user not found (deleted?), re-create guest
    redirect("/api/auth/guest");
  }

  return <VeggieApp user={user} />;
}
