import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, WagmiConfig, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import Layout from "../components/layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const alchemyId = "IoryLeAYX67s6RH1qGGtPidVIMf_PILG";
const chains = [chain.goerli];

const wagmiClient = createClient(
  getDefaultClient({
    appName: "compounder.fi",
    alchemyId,
    chains,
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
  );
}

export default MyApp;
