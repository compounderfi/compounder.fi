import type { NextPage } from "next";
import Head from "next/head";
import PublicStats from "../components/publicStats";
import { useAccount, useContractRead } from "wagmi";
import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import PositionCard from "../components/positionCard";
import abi from "../utils/abi.json";
import { InfuraProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { element } from "@rainbow-me/rainbowkit/dist/css/reset.css";

const contractAddress = "0xcCd82390dc5C760403d48EA3cEc937C91d6051d7";
const provider = new InfuraProvider("goerli");

function Index() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const { data } = useContractRead({
    addressOrName: "0xcCd82390dc5C760403d48EA3cEc937C91d6051d7",
    contractInterface: abi,
    functionName: "addressToTokens",
    args: address,
  });

  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const newIds: string[] = [];
    data?.forEach((element) => {
      newIds.push(element.toString());
    });

    setIds(newIds);
  }, [data]);

  return (
    <>
      {isMounted && !isConnected && (
        <>
          <p className="px-4 text-xl">
            compounder.fi automatically compounds uniswap liquidity position
            earnings
          </p>

          <div className="my-4 px-4">
            <PublicStats />
          </div>

          <p className="mt-4 px-4 text-xl">connect wallet to continue</p>
        </>
      )}

      {isMounted && isConnected && (
        <>
          <p className="px-4 text-xl">active positions</p>
          <div className="mt-2">
            <PositionGrid ids={ids} activePositions={true}></PositionGrid>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
