import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";

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
      <NFTPreview id={id}></NFTPreview>

      <div className="pt-2">
        <div>
          <div className="text-xl">apr: x.xx%</div>
          <div className="text-xl">apy: x.xx%</div>
        </div>
      </div>
    </PositionCard>
  );
}
