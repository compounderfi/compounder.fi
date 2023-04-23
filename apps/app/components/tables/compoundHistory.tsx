import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState, useReducer } from "react";
import { useNetwork } from "wagmi";
import Image from "next/image";
// @ts-ignore
import { tokenToSignificant } from "@thanpolas/crypto-utils";
import ago from "s-ago"

type tokenIdWithChain = {
  tokenId: string;
  chainId: number;
};
export type Compound = {
  chain: number;
  transactionHash: string;
  tokenId: tokenIdWithChain;
  time: number;
  percentLiquidityAdded: string;
  gasPrice: string;
  gasUsed: string;
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

  const rerender = useReducer(() => ({}), {})[1];

  const [sorting, setSorting] = useState<SortingState>([
    {id: "time", desc: true}
  ]);
  
  const columns = [
    columnHelper.accessor("chain", {
      cell: (val) =>
        (() => {
          switch (val.getValue()) {
            case 1:
              return (
                <Image
                  alt="ethereum logo"
                  width={30}
                  height={30}
                  className="pl-2"
                  src="/ethereum.svg"
                ></Image>
              );
            case 10:
              return (
                <Image
                  alt="optimism logo"
                  width={30}
                  height={30}
                  className="pl-2"
                  src="/optimism.svg"
                ></Image>
              );
            case 42161:
              return (
                <Image
                  alt="arbitrum logo"
                  width={30}
                  height={30}
                  className="pl-2"
                  src="/arbitrum.svg"
                ></Image>
              );
            case 137:
              return (
                <Image
                  alt="polygon logo"
                  width={30}
                  height={30}
                  className="pl-2"
                  src="/polygon.svg"
                ></Image>
              );
            default:
              return <></>;
          }
        })(),
    }),
    columnHelper.accessor("transactionHash", {
      header: "txn",
      cell: (val) => (
        <Link href={val.getValue()}>
          <span className="cursor-pointer">
            {val
              .getValue()
              .substring(
                val.getValue().search("/tx/") + 4,
                val.getValue().search("/tx/") + 9
              )}
          </span>
        </Link>
      ),
    }),
    columnHelper.accessor("tokenId", {
      header: "id",
      cell: (val) => (
        <Link href={"/position/" + val.getValue().chainId + "/" + val.getValue().tokenId}>
          <span className="cursor-pointer">
            {val.getValue().tokenId}
          </span>
        </Link>
      ),
    }),
    columnHelper.accessor("time", {
      header: "time",
      cell: (val) => (
        <div>
          {ago(new Date(val.getValue()))}
        </div>
      )
    }),
    columnHelper.accessor("percentLiquidityAdded", {
      header: "liq add",
      cell: (val) => (
        <div>
          {val.getValue() && (Number(val.getValue())).toFixed(2) + "%"}
        </div>
      ),
    }),
    columnHelper.accessor("gasPrice", {
      header: "gas price",
      cell: (val) => (
        <div>
          {val.getValue() &&
            tokenToSignificant(Number(val.getValue()), 9) + " gwei"}
        </div>
      ),
    }),
    columnHelper.accessor("gasUsed", {
      header: "gas used",
    }),
    columnHelper.accessor("callerReward", {
      header: "caller reward",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    
  });

  return (
    <table className="mt-2 w-full table-auto text-base">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
              );
            })}
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
