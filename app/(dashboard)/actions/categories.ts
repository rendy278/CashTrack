"use server";
import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categoriesSchema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parseBody = CreateCategorySchema.safeParse(form);

  if (!parseBody.success) {
    throw new Error("Invalid request body");
  }

  const { icon, name, type } = parseBody.data;

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.create({
    data: {
      userId: user.id,
      icon,
      name,
      type,
    },
  });
}
