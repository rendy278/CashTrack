import Link from "next/link";
import { GiWallet } from "react-icons/gi";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <GiWallet className=" h-11 w-11  text-sky-500 " />
      <h1
        className="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-lg md:text-3xl 
      font-bold leading-tight tracking-tighter text-transparent"
      >
        CashTrack
      </h1>
    </Link>
  );
};

export default Logo;
