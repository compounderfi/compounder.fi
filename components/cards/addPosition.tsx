import PositionCard from "./positionCard";
import Link from "next/link";

export default function AddPositionCard() {
  return (
    <PositionCard href="/positions/add">
      <div>
        <div className="text-center text-6xl">+</div>
        <div className="text-center text-4xl">add position</div>
      </div>
    </PositionCard>
  );
}
