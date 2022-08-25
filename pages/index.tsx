import type { NextPage } from "next";
import Head from "next/head";
import PublicStats from "../components/publicStats";
import { useAccount } from "wagmi";
import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();
  return (
    <>
      <Head>
        <title>compounder.fi</title>
        <meta
          name="description"
          content="compounder.fi automatically compounds uniswap liquidity position earnings."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="px-4 text-xl">
        compounder.fi automatically compounds uniswap liquidity position
        earnings.
      </p>

      <div className="mt-4 px-4">
        <PublicStats />
      </div>
    </>
  );
};

export default Home;
