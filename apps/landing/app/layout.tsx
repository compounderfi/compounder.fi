import Header from "./components/header";
import "./globals.css";

// import { Work_Sans } from '@next/font/google'

// const workSans = Work_Sans()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#EEF1EF] text-[#1C2321]">
      {/* <html lang="en" className={workSans.className + " bg-black text-white"}> */}
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="max-w-[1024px] mx-auto px-6 sm:px-10">
        <Header></Header>

        {children}
      </body>
    </html>
  );
}
