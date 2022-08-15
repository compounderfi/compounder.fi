import type { NextPage } from "next";
import Head from "next/head";
import PublicStats from "../components/publicStats";
import { useAccount } from "wagmi";
import PositionGrid from "../components/positionGrid";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

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

      <p>
        compounder.fi automatically compounds uniswap liquidity position
        earnings.
      </p>

      <div className="mt-4">
        <PublicStats />
      </div>

      <div className={`mt-4  ${isConnected ? "blur-none" : "blur-lg"}`}>
        <PositionGrid />
      </div>
    </>
  );
};

export default Home;
