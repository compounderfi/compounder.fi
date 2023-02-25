import { useAccount } from "wagmi";
import HomePageGrid from "../components/grids/homePageGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AllPositions from "./positions/all";

function Index() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const [ids, setIds] = useState<string[]>([]);

  const router = useRouter();

  if (address) {
    router.push(`/positions/${address}`);
  }

  return (
    <>
      <Head>
        <title>compounder.fi</title>
      </Head>
      {isMounted && !isConnected && (
        <>
          <p className="px-4 text-xl">
            compounder.fi automatically compounds uniswap liquidity position
            earnings
          </p>

          <br/>
          <AllPositions/>
        </>
      )}

      {isMounted && isConnected && (
        <>
          <p className="px-4 text-xl">your active positions</p>
          <div className="mt-2">
            <HomePageGrid showAddPositionCard={true} ids={ids}></HomePageGrid>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
