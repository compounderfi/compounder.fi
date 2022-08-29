import PublicStats from "../components/publicStats";
import { useAccount, useContractRead } from "wagmi";
import HomePageGrid from "../components/grids/homePageGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import abi from "../utils/abi.json";
import { InfuraProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";

import { CONTRACT_ADDRESS } from "../utils/constants";

const provider = new InfuraProvider();

function Index() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const { data } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
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
            <HomePageGrid ids={ids}></HomePageGrid>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
