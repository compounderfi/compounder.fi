import { Interface } from "ethers/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";
import { MouseEventHandler } from "react";

const fetcher = (id: string) =>
  fetch("/api/tokenImage/" + id).then((res) => res.text());

const iface = new Interface([
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
]);

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
  const { data, error } = useSWR(id, fetcher);

  const borderClasses = selected
    ? " border-4 border-blue-500"
    : " border-2 border-gray-200";

  return (
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
            <Image height="700px" width="500px" src={data!}></Image>
            <div className="pl-8 text-xl font-bold">apr: x.xx%</div>
            <div className="pl-8 text-xl font-bold">apy: x.xx%</div>
          </div>
        </div>
      )}
    </div>
  );
}
