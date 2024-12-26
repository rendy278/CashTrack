"use client";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";
import CountUp from "react-countup";

const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background border-foreground p-4">
      <TooltipRow
        formatter={formatter}
        label="expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipRow
        formatter={formatter}
        label="income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipRow
        formatter={formatter}
        label="balance"
        value={income - expense}
        bgColor="bg-sky-500"
        textColor="text-sky-500"
      />
    </div>
  );
};

export default CustomTooltip;

const TooltipRow = ({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  formatter: Intl.NumberFormat;
}) => {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between items-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm font-bold"
          />
        </div>
      </div>
    </div>
  );
};
