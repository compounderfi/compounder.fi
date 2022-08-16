import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen w-[1024px] max-w-full flex-col px-10 ">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
