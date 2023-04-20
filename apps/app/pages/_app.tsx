import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, WagmiConfig, chain, configureChains } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import Layout from "../components/layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from 'next/head'

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const wagmiClient = createClient(
  getDefaultClient({
    appName: "compounder.fi",
    chains,
    autoConnect: true,
  })
);

const muiTheme = createTheme({
  typography: {
    fontFamily: [
      "Work Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    </Head>
    <link
        rel="icon"
        type="image/svg+xml"
        href="/favicondarkmode.ico"
        media="(prefers-color-scheme: dark"
        />
        <link
        rel="icon"
        type="image/svg+xml"
        href="/faviconlightmode.ico"
        media="(prefers-color-scheme: light"
        />
    <ThemeProvider theme={muiTheme}>
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
    </ThemeProvider>
    </>
    
  );
}

export default MyApp;
