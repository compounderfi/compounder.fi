import Link from "next/link";
import AddPositionCard from "../cards/addPosition";
import ActivePositionCard from "../cards/activePosition";

export interface HomePageGridProps {
  ids: string[];
}

export default function HomePageGrid({ ids }: HomePageGridProps) {
  const positions = ids.map((id) => (
    <Link key={id} href={"/position/" + id}>
      <ActivePositionCard id={id}></ActivePositionCard>
    </Link>
  ));

  return (
    <div className="flex flex-wrap gap-8 px-4 pb-4 pt-4">
      <AddPositionCard></AddPositionCard>
      {positions}
    </div>
  );
}
