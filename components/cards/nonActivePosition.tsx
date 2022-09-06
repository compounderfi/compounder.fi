import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import APStats from "./APStats";

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
        <APStats tokenID={id}></APStats>
      </div>
    </PositionCard>
  );
}
