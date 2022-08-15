import { Interface } from "ethers/lib/utils";
import Link from "next/link";
import { useContractRead } from "wagmi";
import { useState, useEffect } from "react";

const iface = new Interface([
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
]);

export interface PositionCardProps {
  id?: string;
}

export default function PositionCard({ id }: PositionCardProps) {
  const { data, error, isError, isLoading } = useContractRead({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: iface,
    functionName: "tokenURI",
    args: id,
  });

  console.log(data);
  console.log(error);

  return (
    <div className="h-[550px] w-[330px] rounded-md border-2 border-black ">
      {!id && (
        <Link href={"/add"}>
          <div className="flex h-full cursor-pointer items-center justify-items-center">
            <div className="mx-auto">
              <div className="text-center text-8xl">+</div>
              <div className="text-center text-4xl">Add Position!</div>
            </div>
          </div>
        </Link>
      )}

      {id && (
        <div className="flex h-full items-center justify-items-center">
          <div className="mx-auto">
            <div className="text-center text-4xl">{id}</div>
          </div>
        </div>
      )}
    </div>
  );
}
