import PositionCard from "./positionCard";
import NFTCanvas from "./nftCanvas";

export interface NonActivePositionProps {
  id: string;
  selected: boolean;
}

export default function NonActivePositionCard({
  id,
  selected,
}: NonActivePositionProps) {
  return (
    <PositionCard selected={selected}>
      <NFTCanvas id={id}></NFTCanvas>

      <div className="px-8">
        <div>
          <div className="text-xl">apr: x.xx%</div>
          <div className="text-xl">apy: x.xx%</div>
        </div>
      </div>
    </PositionCard>
  );
}
