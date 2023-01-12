import {
    Row,
    Cell,
    flexRender
} from "@tanstack/react-table";
import { Position } from "../tables/positions";

export interface PositionRowProps {
    row: Row<Position>;
  }

export interface PositionCellProps {
    cell: Cell<Position, unknown>;
}

function PositionCell({cell}: PositionCellProps) {

    return (
        <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
    )
}
export default function positionRow({row}: PositionRowProps) {
    return (
        <tr className="odd:bg-[#f0f2f5]">
        {row.getVisibleCells().map((cell) => (
            <PositionCell cell={cell} key={cell.id}></PositionCell>
        ))}
        </tr>
    )
    
}