import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="compounder.fi automatically compounds uniswap liquidity position earnings."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        style={{ paddingLeft: "calc(100vw - 100%)" }}
        className="text-[#373737]"
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
