import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Keep using shared prisma instance
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.log.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
    });

    const formattedLogs = logs.map((log) => ({
      ...log,
      veggies: JSON.parse(log.veggies),
      vitamins: JSON.parse(log.vitamins),
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user exists (optional, but good for integrity)
    // const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    // Optimization: Just trust the cookie or rely on logic.
    // Let's assume the user exists if the cookie is set for now to keep it simple,
    // or quickly check. checking is safer.

    const body = await request.json();

    const newLog = await prisma.log.create({
      data: {
        date: body.date,
        mealName: body.mealName,
        veggies: JSON.stringify(body.veggies),
        vitamins: JSON.stringify(body.vitamins),
        userId: parseInt(userId),
      },
    });

    const formattedLog = {
      ...newLog,
      veggies: JSON.parse(newLog.veggies),
      vitamins: JSON.parse(newLog.vitamins),
    };

    return NextResponse.json({ success: true, log: formattedLog });
  } catch (error) {
    console.error("Error saving log:", error);
    return NextResponse.json({ error: "Failed to save log" }, { status: 400 });
  }
}
