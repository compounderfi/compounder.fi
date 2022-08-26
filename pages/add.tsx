import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import useSWR from "swr";

const query = (address: string) =>
  fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
    body: `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
    method: "POST",
  }).then((res) => res.json());

function Add() {
  const isMounted = useIsMounted();
  const [selection, setSelection] = useState<string[]>([]);

  const { address, isConnected } = useAccount();
  // const address = "0x365F45298Ae6039143C113Eb4ad89c7227818AAC";
  const { data, error } = useSWR(address, query);

  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const newIds: string[] = [];

    if (data == undefined) {
      return;
    }

    data.data.positions.forEach((position: { id: string }) => {
      newIds.push(position.id);
    });

    setIds(newIds);
  }, [data]);

  return (
    <>
      {isMounted && data !== undefined && isConnected && (
        <>
          {ids.length > 0 && (
          <>
          <p className="px-4 text-xl ">select positions to add</p>
          <div className="mt-2">
            <PositionGrid
              ids={ids}
              selection={selection}
              setSelection={setSelection}
            ></PositionGrid>
          </div>
          </>
          )}

          {ids.length == 0 && (
            <>
            <p className="px-4 text-xl ">no uniswap v3 positions found</p>

            </>


          )}


        </>
      )}

      {selection.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-200 ">
          <div className="flex">
            <p className="py-8 pl-12">
              {selection.length}{" "}
              {selection.length == 1 ? "position " : "positions "}selected
            </p>
            <div className="grow"></div>

            <button className="w-[232px] bg-gray-300 " tabIndex={-1}>
              deposit {selection.length == 1 ? "position " : "positions"}
            </button>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="flex">
          <p className="mx-auto text-xl font-bold">
            🔒 connect wallet to add positions 🔒
          </p>
        </div>
      )}
    </>
  );
}

export default Add;
