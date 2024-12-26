import prisma from "@/lib/prisma";
import { getHistoryDataSchema } from "@/schema/historySchema";
import { Period, TimeFrame } from "@/types/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { NextResponse } from "next/server";

// Named export for the GET method
export const GET = async (request: Request) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get("timeFrame");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const queryParams = getHistoryDataSchema.safeParse({
      timeFrame,
      year: year ? parseInt(year, 10) : undefined,
      month: month ? parseInt(month, 10) : undefined,
    });

    if (!queryParams.success) {
      return NextResponse.json(
        { error: queryParams.error.message },
        { status: 400 }
      );
    }

    const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
      month: queryParams.data.month,
      year: queryParams.data.year,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// Helper Functions
export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeFrame: TimeFrame,
  period: Period
) {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(userId, period.year!);
    case "month":
      return await getMonthHistoryData(userId, period.year!, period.month!);
    default:
      throw new Error("Invalid time frame provided.");
  }
}

interface HistoryData {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
}

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [
      {
        month: "asc",
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let i = 1; i <= 12; i++) {
    let expense = 0;
    let income = 0;

    const monthData = result.find((row) => row.month === i);
    if (monthData) {
      expense = monthData._sum.expense || 0;
      income = monthData._sum.income || 0;
    }

    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  return history;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });
  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    history.push({
      year,
      month,
      day: i,
      expense,
      income,
    });
  }

  return history;
}
