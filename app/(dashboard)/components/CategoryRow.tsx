import { Category } from "@prisma/client";
import React from "react";

interface Props {
  category: Category;
}

const CategoryRow = ({ category }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <p>{category.name}</p>
    </div>
  );
};

export default CategoryRow;
