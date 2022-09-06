import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import abi from "../../utils/abi.json";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
} from "wagmi";
import { MouseEvent } from "react";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { Tooltip } from "@mui/material";
import {
  ArrowRightOnRectangleIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import APStats from "./APStats";

export interface ActivePositionProps {
  id: string;
  showPointer?: boolean;
}

export default function ActivePositionCard({
  id,
  showPointer,
}: ActivePositionProps) {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi,
    functionName: "withdrawToken",
    args: [id, address, true, 0],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  let withdrawButtonDisabled = false;

  const { chain } = useNetwork();

  function withdraw(e: MouseEvent) {
    e.stopPropagation();

    if (data?.hash) {
      const explorerURI =
        chain?.id == 1
          ? `https://etherscan.io/tx/${data.hash}`
          : `https://${chain?.name}.etherscan.io/tx/${data.hash}`;
      window.open(explorerURI, "_blank");
      return;
    }

    if (
      isLoading == true ||
      isSuccess == true ||
      txnStatus.data !== undefined
    ) {
      return;
    }

    write?.();
  }

  let tooltipMessage = "withdraw position";

  if (isLoading) {
    tooltipMessage = "confirm txn in wallet";
  }
  if (isSuccess) {
    tooltipMessage = "txn submitted, click to view txn in explorer";
  }
  if (txnStatus.isSuccess) {
    tooltipMessage = "txn confirmed, click to view txn in explorer";
  }

  return (
    <PositionCard showPointer={showPointer} href={"/position/" + id}>
      <div>
        <NFTPreview id={id}></NFTPreview>
        <div className="flex pt-2">
          <APStats tokenID={id}></APStats>
          <div className="flex-grow"> </div>
          <div>
            <Tooltip arrow title={tooltipMessage}>
              <button
                disabled={withdrawButtonDisabled}
                tabIndex={-1}
                onClick={(e) => withdraw(e)}
                className="mt-1 rounded-lg bg-gray-200 py-3 px-4 transition-colors duration-300 hover:bg-gray-300"
              >
                {!isLoading && !isSuccess && !data && (
                  <ArrowRightOnRectangleIcon className="h-6 w-6"></ArrowRightOnRectangleIcon>
                )}

                {isLoading && (
                  <PaperAirplaneIcon className="h-6 w-6"></PaperAirplaneIcon>
                )}

                {isSuccess && !txnStatus.isSuccess && (
                  <EllipsisHorizontalIcon className="h-6 w-6"></EllipsisHorizontalIcon>
                )}

                {txnStatus.isSuccess && (
                  <CheckCircleIcon className="h-6 w-6"></CheckCircleIcon>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </PositionCard>
  );
}
