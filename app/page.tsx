import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import VeggieApp from "./components/VeggieApp";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    redirect("/login");
  }

  return <VeggieApp user={user} />;
}
