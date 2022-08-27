import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import { useState, useEffect } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import useSWR from "swr";
import { defaultAbiCoder, parseEther, Interface } from "ethers/lib/utils";

const abi = new Interface([
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
]);

const query = (address: string) =>
  fetch("https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli", {
    body: `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
    method: "POST",
  }).then((res) => res.json());

function Add() {
  const isMounted = useIsMounted();
  const [selection, setSelection] = useState<string[]>([]);
  const [functionName, setFunctionName] = useState("");
  const [functionArgs, setFunctionArgs] = useState<any>([]);

  const { address, isConnected } = useAccount();
  const { data } = useSWR(address, query);

  const [ids, setIds] = useState<string[]>([]);

  const { config, error } = usePrepareContractWrite({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: abi,
    functionName: functionName,
    args: functionArgs,
  });

  console.log(error);

  const { write } = useContractWrite(config);

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

  useEffect(() => {
    if (selection.length == 1) {
      setFunctionName("safeTransferFrom");
      setFunctionArgs([
        address!,
        "0xBAbAA738840d0Ac22979e3fB87464e6ec13275c0",
        selection[0],
      ]);
      return;
    }

    setFunctionName("multicall");
    let data: string[] = [];
    selection.map((i) => {
      data.push(
        abi.encodeFunctionData("safeTransferFrom", [
          address,
          "0xBAbAA738840d0Ac22979e3fB87464e6ec13275c0",
          i,
        ])
      );
    });

    setFunctionArgs([data]);
  }, [selection]);

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

      {isMounted && selection.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-200 ">
          <div className="flex">
            <p className="py-8 pl-12">
              {selection.length}{" "}
              {selection.length == 1 ? "position " : "positions "}selected
            </p>
            <div className="grow"></div>

            <button
              onClick={() => write?.()}
              className="w-[232px] bg-gray-300 "
              tabIndex={-1}
            >
              deposit {selection.length == 1 ? "position " : "positions"}
            </button>
          </div>
        </div>
      )}

      {isMounted && !isConnected && (
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
