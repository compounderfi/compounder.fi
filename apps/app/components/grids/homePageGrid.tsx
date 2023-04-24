import Link from "next/link";
import AddPositionCard from "../cards/addPosition";
import ActivePositionCard from "../cards/activePosition";
import { useNetwork } from "wagmi";

export interface HomePageGridProps {
  ids: string[];
  showAddPositionCard: boolean;
}

export default function HomePageGrid({
  ids,
  showAddPositionCard,
}: HomePageGridProps) {
  const {chain} = useNetwork();
  const positions = ids.map((id) => (
    <Link key={id} href={"/position/" + chain?.id + "/" + id}>
      <ActivePositionCard id={id} chainId={chain?.id || 1} isCompounding={true}></ActivePositionCard>
    </Link>
  ));

  return (
    <div className="flex flex-wrap gap-8 px-4 pb-4 pt-4">
      {showAddPositionCard && <AddPositionCard></AddPositionCard>}
      {positions}
    </div>
  );
}
