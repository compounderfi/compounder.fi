import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
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
