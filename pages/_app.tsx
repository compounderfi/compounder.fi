import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, WagmiConfig, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import Layout from "../components/layout";

const alchemyId = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
const chains = [chain.mainnet];

const wagmiClient = createClient(
  getDefaultClient({
    appName: "compounder.fi",
    alchemyId,
    chains,
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider
        mode="light"
        customTheme={{
          "--ck-font-family": "Work Sans",
          "--ck-connectbutton-box-shadow":
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
