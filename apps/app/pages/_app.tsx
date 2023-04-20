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
    <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Earn compound interest on UniswapV3 with Compounder.fi - the automated, gas-efficient, and decentralized solution for maximizing LP returns." />
      <meta name="keywords" content="UniswapV3, liquidity provider, LP, compound interest, DeFi, decentralized finance, gas efficiency, custodial, Compounder.fi" />
      <meta name="author" content="Compounder.fi" />
      <meta name="keywords" content="uniswap, compound, interest, reinvest, ethereum, polygon, arbitrum, optimism, blockchain, crypto, currency" />
      <meta name="format-detection" content="telephone=no"/>
      <meta name="theme-color" content="#81e291" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://compounder.fi/" />
      <meta property="og:title" content="Compound Interest on UniswapV3" />
      <meta property="og:description" content="Compounder reinvests UniswapV3 fees back into your position. Automatically, efficiently, and at a low fee" />
      <meta property="og:image" content="https://compounder.fi/thumbnail.jpg" />

      {/* Twitter */}
      <meta name="twitter:site" content="@compounderfi"></meta>
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:url" content="https://compounder.fi/" />
      <meta property="twitter:title" content="Compound Interest on UniswapV3" />
      <meta property="twitter:description" content="Compounder reinvests UniswapV3 fees back into your position. Automatically, efficiently, and at a low fee" />
      <meta property="twitter:image" content="https://compounder.fi/thumbnail.jpg" />
        
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
