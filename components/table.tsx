import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type Compound = {
  transactionHash: string;
  time: string;
  usdcCompounded: string;
  ethCompounded: string;
  callerReward: string;
};

const columnHelper = createColumnHelper<Compound>();

const columns = [
  columnHelper.accessor("transactionHash", {
    header: "txn",
    cell: (val) => val.getValue().substring(0, 10) + "...",
  }),
  columnHelper.accessor("time", {}),
  columnHelper.accessor("usdcCompounded", {
    header: "usdc compounded",
  }),
  columnHelper.accessor("ethCompounded", {
    header: "eth compounded",
  }),
  columnHelper.accessor("callerReward", {
    header: "caller reward",
  }),
];

export interface TableProps {
  data: Compound[];
}

export default function Table({ data }: TableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mt-2 w-full table-fixed text-base">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
