import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  ColumnDef
} from "@tanstack/react-table";
import Link from "next/link";
import CompoundButton from "../compoundButton";
import PositionRow from "./positionRow";
import PositionFees from "./positionFees";
import { useState, useEffect } from "react";
import { chainId, useNetwork } from "wagmi";

export type Position = {
  tokenID: string;
  feesID: string;
  compoundID: string;
};

const columnHelper = createColumnHelper<Position>();


export interface PositionsTableProps {
  data: Position[];
}

export default function PositionsTable({ data }: PositionsTableProps) {
  type PositionToDataTypes = {[key: string]: {}}
  const [positionToData, setPositionToData] = useState<PositionToDataTypes>({})
  const [columns, setColumns] = useState<ColumnDef<Position, string>[]>([])

  function UpdatePosition(tokenId: string, apiResponse: any) { //used for lifting state up from PositionFees
    setPositionToData((oldData) => ({...oldData, [tokenId]: { apiResponse }}))//write it back to state
    
  }

  //usenetwork hook
  const {chain} = useNetwork();

  useEffect(() => {
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
      columnHelper.accessor("feesID", {
        header: "compounding fees",
        cell: (info) => (
          <PositionFees tokenID={info.getValue()} updater={UpdatePosition}></PositionFees>
        ),
      }),
    ];
    setColumns(columns)
  }, [])

  useEffect(() => {
    if (positionToData) {
      let shouldDisplay = true
      const newValue = columnHelper.accessor("compoundID", {
        header: "compound",
        cell: (info) => (positionToData[info.getValue()] 
          ? <CompoundButton tokenID={info.getValue()} row={info.row} apiRequest={positionToData[info.getValue()]} chainIdOfPosition = {chain?.id}></CompoundButton>
          : <p>Loading...</p>)
      })

      setColumns((prevValues) => [...prevValues.slice(0, 2), newValue])
    }
  }, [positionToData])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 7
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
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
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        
      </div>
    </div>
  );
}
