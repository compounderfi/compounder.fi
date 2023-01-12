import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import CompoundButton from "../compoundButton";
import PositionRow from "./positionRow"
import PositionFees from "./positionFees"

export type Position = {
  tokenID: string
};

const columnHelper = createColumnHelper<Position>();

const columns = [
  columnHelper.accessor("tokenID", {
    header: "token id",
    cell: (info) => (
      <Link href={"/position/" + info.getValue()}>
        <span className="cursor-pointer underline	decoration-1 underline-offset-4">
          {info.getValue()}
        </span>
      </Link>
    ),
  }),
  columnHelper.accessor("tokenID", {
    header: "estimated fees",
    cell: (info) => (
      <PositionFees tokenID={"" + info.getValue()}></PositionFees>
    ),
  }),
  columnHelper.display({
    header: "compound",
    cell: (props) => <CompoundButton row={props.row}></CompoundButton>,
  }),
];

export interface PositionsTableProps {
  data: Position[];
}

export default function PositionsTable({ data }: PositionsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mx-4 mt-4 w-full table-fixed">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="text-left" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <PositionRow row={row} key={row.id}></PositionRow>
        ))}
      </tbody>
    </table>
  );
}
