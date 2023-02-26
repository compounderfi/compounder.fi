import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect } from "react";
import { useNetwork } from "wagmi";

export type Compound = {
  chain: number;
  transactionHash: string;
  time: string;
  token0Compounded: string;
  token1Compounded: string;
  callerReward: string;
};

export interface TableProps {
  data: Compound[];
  token0: string;
  token1: string;
}

export default function CompoundHistoryTable({
  data,
  token0,
  token1,
}: TableProps) {
  const columnHelper = createColumnHelper<Compound>();
  const { chain } = useNetwork();

  const columns = [
    columnHelper.accessor("chain", {
      cell: (val) => (
        (()=>{
          switch (val.getValue()) {
            case 1 : return <img className="pl-2" src="/ethereum.svg"></img>;
            case 10 : return <img className="pl-2" src="/optimism.svg"></img>;
            case 42161 : return <img className="pl-2" src="/arbitrum.svg"></img>;
            case 137 : return <img className="pl-2" src="/polygon.svg"></img>;
            default: return <></>
          }
        })()
      )
    }),
    columnHelper.accessor("transactionHash", {
      header: "txn",
      cell: (val) => (
        <Link
          href={
            val.getValue()
          }
        >
          <span className="cursor-pointer">
            {val.getValue().substring(val.getValue().search("/tx/") + 4, val.getValue().search("/tx/") + 9)}
          </span>
        </Link>
      ),
      meta: {
        width: 200,
      },
    }),
    columnHelper.accessor("time", {}),
    columnHelper.accessor("token0Compounded", {
      header: token0 && token0 && "token0" + " compounded",
    }),
    columnHelper.accessor("token1Compounded", {
      header: token1 && token1 && "token1" + " compounded",
    }),
    columnHelper.accessor("callerReward", {
      header: "caller reward",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="mt-2 w-full table-auto text-base">
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
