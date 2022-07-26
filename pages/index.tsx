import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
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

      {/* <ConnectButton
        chainStatus="none"
        showBalance={false}
        accountStatus="address"
      /> */}
    </>
  );
};

export default Home;
