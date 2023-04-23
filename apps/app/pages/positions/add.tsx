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
import { CONTRACT_ADDRESS, CONTRACT_ADDRESS_BSC, NFPM_ADDRESS, NFPM_ADDRESS_BSC } from "../../utils/constants";
import Head from "next/head";
import { request, gql } from "graphql-request";
import getNetworkConfigs from "../../utils/getNetworkConfigs";
const abi = [
  {
    inputs: [
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
    name: "approve",
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
];
const abiInterface = new Interface(abi);

const grabAllPosQuery = gql`
  query GetPositions($address: Bytes!) {
    positions(where: { owner: $address }) {
      id
    }
  }
`;

const grabNotDepoedAlreadyQuery = gql`
  query GetPositions($address: Bytes!) {
    positions(where: { owner: $address, tokenWithdraw: null }) {
      id
    }
  }
`;

function Add() {
  const { chain } = useNetwork();
  let uniswapSubgraphURL: string;

  switch (chain?.id) {
    case 1:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-mainnet"
      break;
    case 137:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-polygon"
      break;
    case 42161:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-arbitrum"
      break;
    case 10:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-optimism"
      break;
    case 56:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-bnb"
      break;
    default:
      uniswapSubgraphURL = "https://api.thegraph.com/subgraphs/name/revert-finance/uniswap-v3-mainnet"
      break;
  }
  const fetcherUni = (variables: { address: string }) =>
    request(uniswapSubgraphURL, grabAllPosQuery, variables);

  const compounderSubgraphUrl = chain ? getNetworkConfigs(chain!.id).graphUrl : getNetworkConfigs(1).graphUrl;
  const fetcherComp = (variables: { address: string }) =>
    request(compounderSubgraphUrl, grabNotDepoedAlreadyQuery, variables);

  const isMounted = useIsMounted();
  const [ids, setIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [functionName, setFunctionName] = useState("");
  const [functionArgs, setFunctionArgs] = useState<any>([]);

  const debouncedSelection = useDebounce(selection, 500);

  const { address, isConnected } = useAccount();
  const { data: addressPositions } = useSWR([{ address: address }, chain], fetcherUni);

  //needs to be lowercased for some fucking reason
  const { data: compPositions } = useSWR([{ address: address?.toLowerCase(), chain }], fetcherComp);

  const { config } = usePrepareContractWrite({
    address: chain?.id != 56 ? NFPM_ADDRESS : NFPM_ADDRESS_BSC,
    abi: abi,
    functionName: functionName,
    args: functionArgs,
    chainId: chain?.id
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const txnStatus = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
  });

  function deposit() {
    if (data?.hash) {
      const explorerURI = chain?.id != 56 ? chain?.blockExplorers?.etherscan?.url + "/tx/" + data.hash : "https://bscscan.com" + "/tx/" + data.hash;
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

    if (addressPositions == undefined || compPositions == undefined) {
      return;
    }

    addressPositions.positions.forEach((position: { id: string }) => {
      const depoed = compPositions.positions.find((i: { id: string }) => i.id == position.id)
      if (depoed == undefined) {
        ids.push(position.id);
      }
    });
    ids.reverse()
    setIds(ids);
  }, [addressPositions, compPositions]);

  useEffect(() => {
    setFunctionName("multicall");
    let data: string[] = [];
    selection.map((i) => {
      data.push(
        abiInterface.encodeFunctionData("approve", [
          chain?.id != 56 ? CONTRACT_ADDRESS : CONTRACT_ADDRESS_BSC,
          i,
        ])
      );
    });
    setFunctionArgs([data]);
  }, [debouncedSelection, selection]);

  return (
    <>
      <Head>
        <title>add positions | compounder.fi</title>
      </Head>
      {isMounted && addressPositions !== undefined && isConnected && (
        <>
          {ids.length > 0 && (
            <>
              <p className="px-4 text-xl ">Select positions to add on {chain?.name}</p>
              <div className="bg-green-100 border-l-4 border-[#81e291] text-green-700 p-4 rounded-md shadow-md m-4">
              
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.729 1.568A1 1 0 0110.271 1h-.542a1 1 0 01-.542.568l-7 3.5A1 1 0 011 5v10a1 1 0 01.729.432l7-3.5a1 1 0 01.542-.432l7 3.5A1 1 0 0119 15V5a1 1 0 01-1.729-.568l-7-3.5zM7.03 9.568a.75.75 0 011.44 0l1.109 4.434a.75.75 0 11-1.439.536l-1.11-4.434a.75.75 0 010-.536zm.69 5.742a.998.998 0 111.999 0 .998.998 0 01-1.999 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold">
                      {'compounder can only collect fees and increase liquidity, and never transfer or remove liquidity from your position'}
                    </p>
                  </div>
                </div>
              </div>

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
              <p className="px-4 text-xl ">No uniswap v3 positions found on {chain?.name}. <a href="https://app.uniswap.org/#/pool">Create</a> one now.</p>
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
