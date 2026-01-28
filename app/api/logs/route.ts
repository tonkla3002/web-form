import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Keep using shared prisma instance
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail)
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const logs = await prisma.log.findMany({
      where: { userId: user.id },
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
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail)
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();

    const newLog = await prisma.log.create({
      data: {
        date: body.date,
        mealName: body.mealName,
        veggies: JSON.stringify(body.veggies),
        vitamins: JSON.stringify(body.vitamins),
        userId: user.id,
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
