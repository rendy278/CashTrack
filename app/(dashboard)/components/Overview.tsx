"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/constant/dateconst";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";
import { useRouter, useSearchParams } from "next/navigation";

const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDateFrom = searchParams.get("from")
    ? new Date(searchParams.get("from")!)
    : startOfMonth(new Date());
  const initialDateTo = searchParams.get("to")
    ? new Date(searchParams.get("to")!)
    : new Date();

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: initialDateFrom,
    to: initialDateTo,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("from", dateRange.from.toISOString().split("T")[0]);
    params.set("to", dateRange.to.toISOString().split("T")[0]);
    router.replace(`?${params.toString()}`);
  }, [dateRange, router]);

  return (
    <section className="w-full flex flex-wrap items-end justify-between gap-2 p-6">
      <h2 className="text-3xl font-bold">Overview</h2>
      <div className="flex items-center gap-x-3">
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;
            if (!from || !to) return;
            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days`
              );
              return;
            }
            setDateRange({ from, to });
          }}
        />
      </div>
      <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
      <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </section>
  );
};

export default Overview;
