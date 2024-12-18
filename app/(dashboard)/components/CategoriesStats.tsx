import { UserSettings } from "@prisma/client";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const CategoriesStats = ({ from, to, userSettings }: Props) => {
  return <div></div>;
};

export default CategoriesStats;
