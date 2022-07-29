import type { NextPage } from "next";
import Head from "next/head";
import HomePageProtectedContent from "../components/homePageProtectedContent";
import PublicStats from "../components/publicStats";
import { useAccount} from "wagmi";

const Home: NextPage = () => {
  const { isConnected } = useAccount()

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
        <HomePageProtectedContent />
      </div>
    </>
  );
};

export default Home;
