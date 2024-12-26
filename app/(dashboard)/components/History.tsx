"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, TimeFrame } from "@/types/transaction";
import { UserSettings } from "@prisma/client";
import { useMemo, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const History = ({ userSettings }: { userSettings: UserSettings }) => {
  const [timeFrame, setTimeFrime] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyData = useQuery({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });

  const dataAvailable = historyData.isSuccess && historyData.data.length > 0;

  return (
    <section className="w-full p-6">
      <h1 className=" text-3xl font-bold">History</h1>
      <div className="container">
        <Card className="col-span-12 mt-2 w-full">
          <CardHeader className="gap-2">
            <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
              <HistoryPeriodSelector
                period={period}
                setPeriod={setPeriod}
                timeFrame={timeFrame}
                setTimeFrame={setTimeFrime}
              />
              <div className="flex h-10 items-center w-full gap-2">
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <p>Income</p>
                </Badge>
                <Badge
                  variant={"outline"}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                  <p>Expense</p>
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonWrapper isLoading={historyData.isFetching}>
              {dataAvailable ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    height={300}
                    data={historyData.data}
                    barCategoryGap={5}
                  >
                    <defs>
                      <linearGradient
                        id="incomebar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset={"0"}
                          stopColor="#10b981"
                          stopOpacity={"1"}
                        />
                        <stop
                          offset={"0"}
                          stopColor="#10b981"
                          stopOpacity={"1"}
                        />
                      </linearGradient>
                      <linearGradient
                        id="expensebar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset={"0"}
                          stopColor="#ef4444"
                          stopOpacity={"1"}
                        />
                        <stop
                          offset={"0"}
                          stopColor="#ef4444"
                          stopOpacity={"1"}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="5 5"
                      strokeOpacity={"0.2"}
                      vertical
                    />
                    <XAxis
                      stroke="#888888"
                      fontSize="12"
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 5, right: 5 }}
                      dataKey={(data) => {
                        const { year, month, day } = data;
                        const yearMonth = new Date(year, month);
                        const date = new Date(year, month, day);
                        if (timeFrame === "year") {
                          return yearMonth.toLocaleDateString("default", {
                            month: "long",
                          });
                        }
                        return date.toLocaleDateString("default", {
                          day: "2-digit",
                        });
                      }}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize="12"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey={"income"}
                      label="Income"
                      fill="url(#incomebar)"
                      radius={4}
                      className="cursor-pointer"
                    />
                    <Bar
                      dataKey={"expense"}
                      label="Expense"
                      fill="url(#expensebar)"
                      radius={4}
                      className="cursor-pointer"
                    />
                    <Tooltip
                      cursor={{ opacity: 0.1 }}
                      content={(props) => (
                        <CustomTooltip formatter={formatter} {...props} />
                      )}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Card
                  className="flex p-6 items-center justify-center flex-col
                bg-background"
                >
                  <h1>No data for the selected period</h1>
                  <p className="text-sm text-muted-foreground">
                    Try selecting a different period or adding some transactions
                  </p>
                </Card>
              )}
            </SkeletonWrapper>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default History;
