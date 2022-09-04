import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import CompoundButton from "../compoundButton";

export type Position = {
  tokenID: string;
  estimatedFees: string;
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
  columnHelper.accessor("estimatedFees", {
    header: "estimated fees",
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
    <table className="mx-4 mt-2 w-full table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="text-left first:pl-2" key={header.id}>
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
          <tr className="odd:bg-[#f0f2f5]" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="first:pl-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
