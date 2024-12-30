import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Button } from "@/components/ui/button"; // Gunakan Button dari komponen Anda
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import CategoryCard from "./CategoryCard";

const CategoryList = ({ types }: { types: Transaction }) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", types],
    queryFn: () =>
      fetch(`/api/categories?types=${types}`).then((res) => res.json()),
  });

  const dataAvailabe = categoriesQuery.data && categoriesQuery.data.length > 0;
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items justify-between gap-2">
            <div className="flex items-center gap-4">
              {types === "expense" ? (
                <TrendingDown className="text-rose-500" size={30} />
              ) : (
                <TrendingUp className="text-emerald-500" size={30} />
              )}
              <div>
                <h1 className="text-lg">
                  {types === "income" ? "Income" : "Expenses"} Categories
                </h1>
                <p className="text-sm text-muted-foreground">Sorted by name</p>
              </div>
            </div>
            <CreateCategoryDialog
              type={types}
              onSuccessCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm flex items-center">
                  <PlusSquare className="text-lg" size={20} />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailabe ? (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  types === "income" ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {types}
              </span>{" "}
              categories found
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data
              ?.filter((category: Category) => category.type === types)
              .map((category: Category) => (
                <CategoryCard category={category} key={category.name} />
              ))}
            {categoriesQuery.data?.filter(
              (category: Category) => category.type === types
            ).length === 0 && (
              <div className="flex flex-col items-start justify-center  w-full  h-40">
                <p className="text-lg font-semibold text-muted-foreground">
                  No{" "}
                  <span
                    className={cn(
                      types === "income" ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    {types}
                  </span>{" "}
                  categories found
                </p>
                <p className="text-sm text-muted-foreground">
                  Create a category to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

export default CategoryList;
