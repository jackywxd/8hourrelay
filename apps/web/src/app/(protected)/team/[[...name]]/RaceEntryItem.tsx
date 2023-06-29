import { RaceEntry } from "@8hourrelay/models";
import { Icons } from "@/components/icons";

function RaceEntryItem({ member }: { member: RaceEntry }) {
  if (!member) {
    return null;
  }
  const { displayName: name, race, email } = member;
  return (
    <div className="flex w-full gap-3">
      <div className="flex h-12 w-12 bg-slate-600 rounded-full items-center justify-center">
        <Icons.user className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="w-full h-12 flex bg-slate-300 dark:bg-slate-900 border justify-between items-center rounded-md">
        <div className="flex-col md:flex w-full">
          <p>{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
    </div>
  );
}

export default RaceEntryItem;
