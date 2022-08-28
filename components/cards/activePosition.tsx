import PositionCard from "./positionCard";
import NFTPreview from "./nftPreview";
import abi from "../../utils/abi.json";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { MouseEvent } from "react";

export interface ActivePositionProps {
  id: string;
}

export default function ActivePositionCard({ id }: ActivePositionProps) {
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    addressOrName: "0xBAbAA738840d0Ac22979e3fB87464e6ec13275c0",
    contractInterface: abi,
    functionName: "withdrawToken",
    args: [id, address, true, 0],
  });

  const { write } = useContractWrite(config);
  function withdraw(e: MouseEvent) {
    e.stopPropagation();
    write?.();
  }
  return (
    <PositionCard href={"/position/" + id}>
      <div>
        <NFTPreview id={id}></NFTPreview>
        <div className="flex px-8">
          <div>
            <div className="text-xl">apr: x.xx%</div>
            <div className="text-xl">apy: x.xx%</div>
          </div>

          <div className="flex-grow"> </div>
          <div>
            <button
              tabIndex={-1}
              onClick={(e) => withdraw(e)}
              className="mt-1 rounded-lg bg-gray-200 py-3 px-4"
            >
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
            </button>
          </div>
        </div>
      </div>
    </PositionCard>
  );
}
