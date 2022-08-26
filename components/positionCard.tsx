import Link from "next/link";
import Image from "next/image";
import { MouseEventHandler, useEffect, useState } from "react";
import { useContractRead } from "wagmi";

const abi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
];

export interface PositionCardProps {
  id?: string;
  onClick?: MouseEventHandler;
  selected?: boolean;
}

export default function PositionCard({
  id,
  onClick,
  selected,
}: PositionCardProps) {
  const [tokenImage, setTokenImage] = useState("");

  const { data, error } = useContractRead({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: abi,
    functionName: "tokenURI",
    args: id,
    chainId: 1,
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

  return (
    <>
      <div
        className={
          "h-[500px] w-[280px] cursor-pointer rounded-[30px] bg-[#f0f2f5] shadow-lg" +
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
              <Image
                height="700px"
                width="500px"
                alt={"Token #" + id}
                src={tokenImage}
              ></Image>
              <div className="pl-8 text-xl">apr: x.xx%</div>
              <div className="pl-8 text-xl">apy: x.xx%</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
