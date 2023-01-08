import PublicStats from "../components/publicStats";
import { useAccount, useContractRead } from "wagmi";
import HomePageGrid from "../components/grids/homePageGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import abi from "../utils/abi.json";
import { InfuraProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../utils/constants";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

const provider = new InfuraProvider();

function Index() {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const { data } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "addressToTokens",
    args: [address],
  });

  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const newIds: string[] = [];
      (data as Array<number>).forEach((element) => {
        newIds.push(element.toString());
      });

      setIds(newIds);
    }
  }, [data]);

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

          <div className="my-4 px-4">
            <PublicStats />
          </div>

          <p className="mt-4 px-4 text-xl">
            connect wallet to continue or{" "}
            <Link href="/positions/all">
              <span className="cursor-pointer underline	decoration-1 underline-offset-4">
                view all deposited positions
              </span>
            </Link>
          </p>
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
