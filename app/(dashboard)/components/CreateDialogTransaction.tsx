"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transactionSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  type: Transaction;
  currentAmount: string;
}

const CreateDialogTransaction = ({ trigger, type, currentAmount }: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    mode: "onChange",
    defaultValues: {
      type,
      date: undefined,
      amount: 0,
      category: "",
      description: "",
    },
  });

  const formatter = useMemo(
    () => GetFormatterForCurrency(currentAmount),
    [currentAmount]
  );

  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      if (form.watch("category") !== value) {
        form.setValue("category", value);
      }
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully", {
        id: "create-transaction",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["overview"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create transaction", {
        id: "create-transaction",
      });
    },
  });

  const onSubmit = useCallback(
    (value: CreateTransactionSchemaType) => {
      toast.loading("Creating transaction...", {
        id: "create-transaction",
      });
      mutate({
        ...value,
        date: DateToUTCDate(value.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-sky-500" : "text-rose-500"
              )}
            >
              {type}
            </span>
            Transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Formatted value: {formatFn(field.value || 0)}
                  </FormDescription>
                </FormItem>
              )}
            />

            <p>
              Transaction Category:
              <span className="font-bold">{form.watch("category")}</span>
            </p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <FormField
                control={form.control}
                name="category"
                render={() => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "flex justify-between items-center w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(new Date(field.value), "yyyy-MM-dd")
                              : "Pick a Date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              isPending ||
              !form.watch("date") ||
              !form.watch("category") ||
              !form.formState.isValid
            }
          >
            {!isPending ? "Create" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialogTransaction;
