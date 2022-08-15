import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen w-[1024px] flex-col ">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
