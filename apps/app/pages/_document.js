import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="compounder.fi automatically compounds uniswap liquidity position earnings."
        />
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
