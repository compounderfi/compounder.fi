import PositionCard from "./positionCard";
import { useAccount } from "wagmi";
import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";

export interface PositionGridProps {
  selection?: string[];
  setSelection?: Dispatch<SetStateAction<string[]>>;
  activePositions?: boolean;
  ids: string[];
}

export default function PositionGrid({
  selection,
  setSelection,
  activePositions = false,
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

  if (activePositions) {
    positions = ids.map((id) => (

      <Link href={"/position/" + id}>

        <PositionCard key={id} id={id}></PositionCard>
      </Link>
    )
    );
  } else {
    positions = ids.map((id) => (
      <PositionCard
        selected={selection!.includes(id)}
        onClick={() => selectPosition(id)}
        key={id}
        id={id}
      ></PositionCard>
    ));
  }

  return (
    <div className="grid">
      <div
        style={{ gridArea: "1/1" }}
        className="flex flex-wrap gap-8 px-4 pb-4 pt-4"
      >
        {activePositions && <PositionCard></PositionCard>}
        {positions}
      </div>

      {/* {!isConnected && (
        <div
          className="z-50 flex place-items-center backdrop-blur-md"
          style={{ gridArea: "1/1" }}
        >
          <p className="mx-auto text-xl font-bold">
            🔒 connect wallet to continue 🔒
          </p>
        </div>
      )} */}
    </div>
  );
}
