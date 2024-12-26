import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Period } from "@/types/transaction";
import { SelectValue } from "@radix-ui/react-select";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
}

const monthDate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const MonthSelector = ({ period, setPeriod }: Props) => {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {monthDate.map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
