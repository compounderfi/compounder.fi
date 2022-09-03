import PublicStats from "../../components/publicStats";
import { useAccount, useContractRead } from "wagmi";
import HomePageGrid from "../../components/grids/homePageGrid";
import { useIsMounted } from "../../hooks/useIsMounted";
import abi from "../../utils/abi.json";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import Head from "next/head";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const { urlAddress } = router.query;

  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const { data } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi,
    functionName: "addressToTokens",
    args: urlAddress,
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
      <Head>
        <title>active positions | compounder.fi</title>
      </Head>
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
          {address == urlAddress && (
            <p className="px-4 text-xl">your active positions</p>
          )}
          {address !== urlAddress && (
            <p className="px-4 text-xl">{urlAddress}&apos;s active positions</p>
          )}
          <div className="mt-2">
            <HomePageGrid
              showAddPositionCard={address == urlAddress}
              ids={ids}
            ></HomePageGrid>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
