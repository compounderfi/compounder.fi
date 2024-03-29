import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="mx-auto max-w-screen-xl flex px-16 py-4" id="top">
      <Link href={"/"}>
        <div className="flex gap-2 ">
          <Image
            alt="compounder.fi logo"
            width={40}
            height={40}
            src="/faviconlightmode.ico"
          ></Image>
          <div className="cursor-pointer text-4xl font-medium">compounder.fi</div>
        </div>
      </Link>
      <div className="flex-grow"></div>
      <div className="hidden sm:block">
        <Link href={"https://app.compounder.fi"}>
          <div className="rounded-full bg-[#81e291] py-2 px-4">launch app</div>
        </Link>
      </div>
    </header>
  );
}
