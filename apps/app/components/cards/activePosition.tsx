import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import abi from "../../utils/uniswapABI.json";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount
} from "wagmi";
import { MouseEvent, useEffect, useState } from "react";
import { NFPM_ADDRESS, NFPM_ADDRESS_BSC } from "../../utils/constants";
import { Tooltip } from "@mui/material";
import {
  ArrowRightOnRectangleIcon,
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import APStats from "./APStats";
import getNetworkConfigs from "../../utils/getNetworkConfigs";
//import constants
import { CONTRACT_ADDRESS, CONTRACT_ADDRESS_BSC, NFPM_ABI } from "../../utils/constants";

export interface ActivePositionProps {
  id: string;
  showPointer?: boolean;
  isCompounding: boolean;
  chainId : number;
}

export default function ActivePositionCard({
  id,
  showPointer,
  isCompounding,
  chainId
}: ActivePositionProps) {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    address: chainId != 56 ? NFPM_ADDRESS : NFPM_ADDRESS_BSC,
    abi: abi,
    functionName: "approve",
    args: [isCompounding ? "0x0000000000000000000000000000000000000000" : chainId != 56 ? CONTRACT_ADDRESS : CONTRACT_ADDRESS_BSC, id],
    chainId: chainId
  });

  const approveData = useContractRead({
    address: chainId != 56 ? NFPM_ADDRESS : NFPM_ADDRESS_BSC,
    abi: NFPM_ABI,
    functionName: "ownerOf",
    args: [id],
    chainId: chainId,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  const [viewerIsOwnerOfNft,   setViewerIsOwnerOfNft] = useState(false);
  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  useEffect(() => {
    if (!approveData) {
      return;
    }  
    if (approveData.data == address) {
      setViewerIsOwnerOfNft(true);
    } else {
      setViewerIsOwnerOfNft(false);
    }
  }, [approveData.data, address]);


  let buttonDisabled = false;
  useEffect(() => {console.log(config, data)}, [data]);
  function doDepositOrWithdraw(e: MouseEvent) {
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

  let tooltipMessage = isCompounding ? "withdraw position" : "deposit position for compounding";

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
          {viewerIsOwnerOfNft && (
          <div>
            <Tooltip arrow title={tooltipMessage}>
              <button
                disabled={buttonDisabled}
                tabIndex={-1}
                onClick={(e) => doDepositOrWithdraw(e)}
                className="mt-1 rounded-lg bg-gray-200 py-3 px-4 transition-colors duration-300 hover:bg-gray-300"
              >
                
                {!isLoading && !isSuccess && !data && isCompounding && (
                  <ArrowRightOnRectangleIcon className="h-6 w-6"></ArrowRightOnRectangleIcon>
                )}

                {!isLoading && !isSuccess && !data && !isCompounding && (
                  <PlusCircleIcon className="h-6 w-6"></PlusCircleIcon>
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
          )}
        </div>
      </div>
    </PositionCard>
  );
}
