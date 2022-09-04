import { Row } from "@tanstack/react-table";
import { Position } from "./tables/positions";

export interface CompoundButtonProps {
  row: Row<Position>;
}

export default function CompoundButton({ row }: CompoundButtonProps) {
  const bgColor = row.index % 2 === 0 ? "bg-gray-200" : "bg-gray-200";

  return (
    <button className={bgColor + " my-2 rounded-lg bg-gray-400 px-2"}>
      compound now
    </button>
  );
}
