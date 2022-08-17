import { Interface } from "ethers/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (id: string) =>
  fetch("/api/tokenImage/" + id).then((res) => res.text());

const iface = new Interface([
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
]);

export interface PositionCardProps {
  id?: string;
}

export default function PositionCard({ id }: PositionCardProps) {
  const { data, error } = useSWR(id, fetcher);
  return (
    <div className="h-[500px] w-[292px] rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] shadow-lg">
      {!id && (
        <Link href={"/add"}>
          <div className="flex h-full cursor-pointer items-center justify-items-center">
            <div className="mx-auto">
              <div className="text-center text-6xl">+</div>
              <div className="text-center text-4xl">add position</div>
            </div>
          </div>
        </Link>
      )}

      {id && (
        <div className="flex h-full items-center justify-items-center">
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
