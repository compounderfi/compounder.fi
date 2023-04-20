import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import APStats from "./APStats";
import { Tooltip } from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { chainId, useNetwork } from "wagmi";
export interface NonActivePositionProps {
  id: string;
  selected: boolean;
}

export default function NonActivePositionCard({
  id,
  selected,
}: NonActivePositionProps) {
  const router = useRouter();
  const { chain } = useNetwork();

  return (
    <PositionCard selected={selected}>
      <NFTPreview id={id} chainId={chain?.id || 1}></NFTPreview>

      <div className="flex pt-2">
        <APStats tokenID={id} chainId={chain?.id || 1}></APStats>
        <div className="flex-grow"> </div>

        <div>
          <Tooltip arrow title="preview position">
            <button
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                router.push("/position/" + chain?.id + "/" + id);
              }}
              className="mt-1 rounded-lg bg-gray-200 py-3 px-4 transition-colors duration-300 hover:bg-gray-300"
            >
              <EyeIcon className="h-6 w-6"></EyeIcon>
            </button>
          </Tooltip>
        </div>
      </div>
    </PositionCard>
  );
}
