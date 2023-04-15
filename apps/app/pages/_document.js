import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Earn compound interest on UniswapV3 with Compounder.fi - the automated, gas-efficient, and decentralized solution for maximizing LP returns." />
        <meta name="keywords" content="UniswapV3, liquidity provider, LP, compound interest, DeFi, decentralized finance, gas efficiency, custodial, Compounder.fi" />
        <meta name="author" content="Compounder.fi" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://compounder.fi/" />
        <meta property="og:title" content="Compounder.fi - Earn Compound Interest on UniswapV3" />
        <meta property="og:description" content="Compounder collects your UniswapV3 fees and reinvests them back into your position. Automatically, efficiently, and at a low fee." />
        <meta property="og:image" content="https://compounder.fi/thumbnail.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://compounder.fi/" />
        <meta property="twitter:title" content="Compounder.fi - Earn Compound Interest on UniswapV3" />
        <meta property="twitter:description" content="Compounder collects your UniswapV3 fees and reinvests them back into your position. Automatically, efficiently, and at a low fee." />
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
