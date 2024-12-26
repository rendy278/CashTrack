import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/types/transaction";

interface Props {
  data: GetCategoriesStatsResponseType;
  type: Transaction;
  formatter: Intl.NumberFormat;
}

const CategoriesCard = ({ data, type, formatter }: Props) => {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Income " : "Expense "}Statistics Category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 ? (
          <div className="flex p-4 w-full flex-col items-center justify-center">
            <h1 className="text-xl font-bold">
              No data for the selected period
            </h1>
            <p className="">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col items-center gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div
                    key={item.category}
                    className="flex flex-col gap-2 w-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <h1 className="flex items-center gap-2 text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </h1>
                      <h1 className="text-gray-400">
                        {formatter.format(amount)}
                      </h1>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-rose-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default CategoriesCard;
