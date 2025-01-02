"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { differenceInDays, startOfMonth } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/constant/dateconst";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TransactionsTable from "../components/TransactionsTable";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
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
    <>
      <div className="border-b bg-card">
        <div className="w-full flex flex-wrap items-center justify-between gap-6 py-8 p-6">
          <div>
            <p className="text-2xl md:text-3xl font-bold">
              Transaction History
            </p>
          </div>
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
      </div>
      <div className="w-full flex flex-wrap items-center justify-between gap-6 py-8 p-6">
        <TransactionsTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
};

export default Page;
