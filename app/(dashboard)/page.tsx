import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateDialogTransaction from "./components/CreateDialogTransaction";
import Overview from "./components/Overview";
import History from "./components/History";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/currency");
  }
  return (
    <main className="w-full h-full bg-background">
      <section className="border-b bg-card">
        <div className=" flex flex-wrap items-center justify-between gap-6 p-4 md:p-6 lg:p-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>
          <div className="flex items-center gap-3">
            <CreateDialogTransaction
              trigger={
                <Button
                  variant={"outline"}
                  className="border-sky-500 bg-sky-950 text-white hover:bg-sky-700 hover:text-white"
                >
                  New Income
                </Button>
              }
              type="income"
            />
            <CreateDialogTransaction
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New Expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </section>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </main>
  );
};

export default page;
