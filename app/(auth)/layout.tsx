import { ReactNode } from "react";
import Logo from "../../components/Logo";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-4">{children}</div>
    </section>
  );
};

export default layout;
