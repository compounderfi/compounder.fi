import Link from "next/link";
import Image from "next/image";
import { MouseEventHandler, MouseEvent, useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
} from "wagmi";
import abi from "../utils/abi.json";

const uniswapAbi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
];

export interface PositionCardProps {
  id?: string;
  onClick?: MouseEventHandler;
  selected?: boolean;
  showStats?: boolean;
  showWithdraw?: boolean;
}

export default function PositionCard({
  id,
  onClick,
  selected,
  showStats = true,
  showWithdraw = true,
}: PositionCardProps) {
  const [tokenImage, setTokenImage] = useState("");
  const { address } = useAccount();

  const { data } = useContractRead({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: uniswapAbi,
    functionName: "tokenURI",
    args: id,
    chainId: 5,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const tokenData = JSON.parse(
      Buffer.from(data.split(",", 2)[1], "base64").toString()
    );
    setTokenImage(tokenData["image"]);
  }, [data]);

  const borderClasses = selected
    ? " border-2 border-[#f0f2f5] outline outline-2 outline-blue-500"
    : " border-2 border-gray-200";

  const hwClasses = showStats ? "h-[496px] w-[280px]" : "h-[496px] w-[320px]";

  const { config, error } = usePrepareContractWrite({
    addressOrName: "0xBAbAA738840d0Ac22979e3fB87464e6ec13275c0",
    contractInterface: abi,
    functionName: "withdrawToken",
    args: [id, address, true, 0],
  });

  const { write } = useContractWrite(config);
  console.log(error);
  console.log(config);

  function withdraw(e: MouseEvent) {
    e.stopPropagation();
    write?.();
  }

  return (
    <>
      <div
        className={
          hwClasses +
          " cursor-pointer rounded-[30px] bg-[#f0f2f5] shadow-lg" +
          borderClasses
        }
      >
        {!id && (
          <Link href={"/add"}>
            <div className="flex h-full items-center justify-items-center">
              <div className="mx-auto">
                <div className="text-center text-6xl">+</div>
                <div className="text-center text-4xl">add position</div>
              </div>
            </div>
          </Link>
        )}

        {id && (
          <div
            onClick={onClick}
            className="flex h-full items-center justify-items-center"
          >
            <div className="mx-auto">
              {/* UNISWAP SVG PAUSE ANIMATION HACK */}
              {/* https://github.com/Uniswap/interface/blob/c207a576e7ebd13b4886d372b3e529c2e32bc53d/src/pages/Pool/PositionPage.tsx#L244 */}
              <Image
                height="700px"
                width="500px"
                alt={"Token #" + id}
                src={tokenImage}
              ></Image>
              <div className="flex px-8">
                {showStats && (
                  <div>
                    <div className="text-xl">apr: x.xx%</div>
                    <div className="text-xl">apy: x.xx%</div>
                  </div>
                )}

                <div className="flex-grow"></div>
                {showWithdraw && (
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
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
