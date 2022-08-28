import { Dispatch, SetStateAction, useState } from "react";
import NonActivePositionCard from "../cards/nonActivePosition";

export interface PositionGridProps {
  selection?: string[];
  setSelection?: Dispatch<SetStateAction<string[]>>;
  ids: string[];
}

export default function SelectableGrid({
  selection,
  setSelection,
  ids,
}: PositionGridProps) {
  function selectPosition(id: string) {
    if (selection!.includes(id)) {
      setSelection!(selection!.filter((_id) => _id !== id));
    } else {
      setSelection!([...selection!, id]);
    }
  }

  let positions;

  positions = ids.map((id) => (
    <div key={id} onClick={() => selectPosition(id)}>
      <NonActivePositionCard
        selected={selection!.includes(id)}
        id={id}
      ></NonActivePositionCard>
    </div>
  ));

  return <div className="flex flex-wrap gap-8 px-4 pb-4 pt-4">{positions}</div>;
}
