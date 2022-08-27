import PublicStats from "../components/publicStats";
import { useAccount, useContractRead } from "wagmi";
import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import abi from "../utils/abi.json";
import { InfuraProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";

const contractAddress = "0xBAbAA738840d0Ac22979e3fB87464e6ec13275c0";
const provider = new InfuraProvider("goerli");

function Index() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const { data } = useContractRead({
    addressOrName: contractAddress,
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
