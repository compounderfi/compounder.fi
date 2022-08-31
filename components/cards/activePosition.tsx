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
          <div>
            <div className="text-xl">apr: x.xx%</div>
            <div className="text-xl">apy: x.xx%</div>
          </div>

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                )}
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                )}

                {isSuccess && !txnStatus.isSuccess && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                )}

                {txnStatus.isSuccess && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </PositionCard>
  );
}
