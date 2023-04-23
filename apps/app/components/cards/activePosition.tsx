import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import abi from "../../utils/uniswapABI.json";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  chain,
} from "wagmi";
import { MouseEvent } from "react";
import { NFPM_ADDRESS, NFPM_ADDRESS_BSC } from "../../utils/constants";
import { Tooltip } from "@mui/material";
import {
  ArrowRightOnRectangleIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import APStats from "./APStats";
import getNetworkConfigs from "../../utils/getNetworkConfigs";

export interface ActivePositionProps {
  id: string;
  showPointer?: boolean;
  isCompounding?: boolean;
  chainId : number;
}

export default function ActivePositionCard({
  id,
  showPointer,
  isCompounding,
  chainId
}: ActivePositionProps) {

  const { config } = usePrepareContractWrite({
    address: chainId != 56 ? NFPM_ADDRESS : NFPM_ADDRESS_BSC,
    abi: abi,
    functionName: "approve",
    args: ["0x0000000000000000000000000000000000000000", id],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  let withdrawButtonDisabled = false;

  function withdraw(e: MouseEvent) {
    e.preventDefault();

    if (data?.hash) {
      const explorerURI = getNetworkConfigs(chainId).explorerUrl + "/tx/" + data.hash;
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
    <PositionCard showPointer={showPointer} isCompounding = {isCompounding} href={"/position/" + chainId + "/" + id}>
      <div>
        <NFTPreview id={id} chainId={chainId}></NFTPreview>
        <div className="flex pt-2">
          <APStats tokenID={id} chainId={chainId}></APStats>
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
