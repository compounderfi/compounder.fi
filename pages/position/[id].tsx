import Link from "next/link";
import { useRouter } from "next/router";
import PositionCard from "../../components/positionCard";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Position() {
  const router = useRouter();
  const { id } = router.query;
  const [tokenID, setTokenID] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    if (Array.isArray(id)) {
      setTokenID(id[0]);
      return;
    }

    setTokenID(id);
  }, [id]);

  return (
    <div className="px-4 text-xl">
      <div className="mt-2 flex gap-6 ">
        <PositionCard showStats={true} id={tokenID}></PositionCard>
        <div className="grid flex-grow gap-6">
          <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
            <div>liquidity</div>
            <div className="mt-2 mb-4 text-3xl">$-</div>
            <div className="rounded-[15px] bg-gray-200 py-4 px-4">
              <div className="flex gap-4 pb-2">
                <Image
                  alt="UNI icon"
                  src="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
                  width={28}
                  layout={"fixed"}
                  height={28}
                ></Image>
                <div className="">UNI</div>
                <div className="flex-grow"></div>
                <div className="">69.420</div>
              </div>
              <div className="flex gap-4">
                <Image
                  alt="UNI icon"
                  src="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
                  width={28}
                  layout={"fixed"}
                  height={28}
                ></Image>
                <div className="">UNI</div>
                <div className="flex-grow"></div>
                <div className="">69.420</div>
              </div>
            </div>
          </div>
          <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
            <div>unclaimed fees</div>
            <div className="mt-2 mb-4 text-3xl">$-</div>
            <div className="rounded-[15px] bg-gray-200 py-4 px-4">
              <div className="flex gap-4 pb-2">
                <Image
                  alt="UNI icon"
                  src="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
                  width={28}
                  layout={"fixed"}
                  height={28}
                ></Image>
                <div className="">UNI</div>
                <div className="flex-grow"></div>
                <div className="">69.420</div>
              </div>
              <div className="flex gap-4">
                <Image
                  alt="UNI icon"
                  src="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
                  width={28}
                  layout={"fixed"}
                  height={28}
                ></Image>
                <div className="">UNI</div>
                <div className="flex-grow"></div>
                <div className="">69.420</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-4">
        <div className="flex">
          <div className="mt-4 flex-grow font-bold">compound history</div>
          <div className="mt-4 text-base">
            estimated time until next compound: 420:69
          </div>
        </div>
        <table className="mt-2 w-full table-fixed text-base">
          <thead>
            <tr>
              <th className="w-[120px] text-left ">txn</th>
              <th className="w-[200px] text-left ">time</th>
              <th className="text-left ">amount compounded</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-[#f0f2f5]">
              <td>0x...4343</td>
              <td>8/27/2022 9:15:23</td>
              <td>dafsfdsafjalksdjflk</td>
            </tr>
            <tr className="odd:bg-[#f0f2f5]">
              <td>0x...4343</td>
              <td>8/27/2022 9:15:23</td>
              <td>dafsfdsafjalksdjflk</td>
            </tr>
            <tr className="odd:bg-[#f0f2f5]">
              <td>0x...4343</td>
              <td>8/27/2022 9:15:23</td>
              <td>dafsfdsafjalksdjflk</td>
            </tr>
            <tr className="odd:bg-[#f0f2f5]">
              <td>0x...4343</td>
              <td>8/27/2022 9:15:23</td>
              <td>dafsfdsafjalksdjflk</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
