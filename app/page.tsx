import { auth } from "@/auth";
import VeggieApp from "./components/VeggieApp";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return <VeggieApp user={session.user} />;
}
