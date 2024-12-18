"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import StatCards from "./StatCards";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const StatsCards = ({ from, to, userSettings }: Props) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCards
          formatter={formatter}
          value={income}
          title="income"
          icon={
            <TrendingUp className="h-12 w-12 items-center flex rounded-lg p-2 text-emerald-500 bg-sky-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCards
          formatter={formatter}
          value={expense}
          title="expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center flex rounded-lg p-2 text-rose-500 bg-sky-400/10" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCards
          formatter={formatter}
          value={balance}
          title="wallet"
          icon={
            <Wallet className="h-12 w-12 items-center flex rounded-lg p-2 text-sky-500 bg-sky-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCards;
