import { useIsMounted } from "../../hooks/useIsMounted";
import { useState, useEffect } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import useSWR from "swr";
import { Interface } from "ethers/lib/utils";
import SelectableGrid from "../../components/grids/selectableGrid";
import { useDebounce } from "../../hooks/useDebounce";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import Footer from "../../components/footer";
import Head from "next/head";

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

function Add() {
  const { chain } = useNetwork();

  let subgraphURL = "";

  if (chain?.id == 5) {
    subgraphURL =
      "https://api.thegraph.com/subgraphs/name/compositelabs/uniswap-v3-goerli";
  } else if (chain?.id == 1) {
    subgraphURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
  }

  const query = (address: string) =>
    fetch(subgraphURL, {
      body: `{\"query\":\"{\\n  positions(where: {owner: \\\"${address}\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`,
      method: "POST",
    }).then((res) => res.json());

  const isMounted = useIsMounted();
  const [ids, setIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [functionName, setFunctionName] = useState("");
  const [functionArgs, setFunctionArgs] = useState<any>([]);

  const debouncedSelection = useDebounce(selection, 500);

  const { address, isConnected } = useAccount();
  const { data: addressPositions } = useSWR(address, query);

  const { config } = usePrepareContractWrite({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: abi,
    functionName: functionName,
    args: functionArgs,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  let depositButtonDisabled = false;

  function deposit() {
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

  let buttonText = (
    <p>deposit {selection.length == 1 ? " position " : " positions"}</p>
  );

  if (isLoading) {
    buttonText = <p>confirm txn in wallet</p>;
  }
  if (isSuccess) {
    buttonText = (
      <>
        <p>txn submitted</p>
        <p>click to view txn in explorer</p>
      </>
    );
  }
  if (txnStatus.isSuccess) {
    buttonText = (
      <>
        <p>txn confirmed</p>
        <p>click to view txn in explorer</p>
      </>
    );
  }

  useEffect(() => {
    const ids: string[] = [];

    if (addressPositions == undefined) {
      return;
    }

    addressPositions.data.positions.forEach((position: { id: string }) => {
      ids.push(position.id);
    });

    setIds(ids);
  }, [addressPositions]);

  useEffect(() => {
    if (selection.length == 1) {
      setFunctionName("safeTransferFrom");
      setFunctionArgs([address!, CONTRACT_ADDRESS, selection[0]]);
    } else {
      setFunctionName("multicall");
      let data: string[] = [];
      selection.map((i) => {
        data.push(
          abi.encodeFunctionData("safeTransferFrom", [
            address,
            CONTRACT_ADDRESS,
            i,
          ])
        );
      });
      setFunctionArgs([data]);
    }
  }, [debouncedSelection]);

  return (
    <>
      <Head>
        <title>add positions | compounder.fi</title>
      </Head>
      {isMounted && addressPositions !== undefined && isConnected && (
        <>
          {ids.length > 0 && (
            <>
              <p className="px-4 text-xl ">select positions to add</p>
              <div className="mt-2">
                <SelectableGrid
                  ids={ids}
                  selection={selection}
                  setSelection={setSelection}
                ></SelectableGrid>
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
        <>
          <div className="h-[64px]"></div>
          <div className="fixed bottom-0 left-0 right-0 bg-gray-200 ">
            <div className="flex">
              <p className="py-8 pl-12">
                {selection.length}{" "}
                {selection.length == 1 ? "position " : "positions "}selected
              </p>
              <div className="grow"></div>

              <button
                onClick={deposit}
                className="w-[232px] bg-gray-300 "
                tabIndex={-1}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </>
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
