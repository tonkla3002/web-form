import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { createdAt: "desc" }, // or 'id' desc to show latest first
    });

    // Convert JSON strings back to objects for the frontend
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
    const body = await request.json();

    // Create new log in database
    const newLog = await prisma.log.create({
      data: {
        date: body.date,
        mealName: body.mealName,
        veggies: JSON.stringify(body.veggies),
        vitamins: JSON.stringify(body.vitamins),
      },
    });

    // Format response to match frontend expectation
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
