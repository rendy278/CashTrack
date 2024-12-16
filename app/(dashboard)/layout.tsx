import { ReactNode } from "react";
import DekstopNavbar from "../../components/DekstopNavbar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="relative flex h-screen w-full flex-col">
      <DekstopNavbar />
      {children}
    </section>
  );
};

export default layout;
