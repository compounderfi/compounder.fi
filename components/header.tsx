import { ConnectKitButton } from "connectkit";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex py-4">
      <Link href="/">
        <div className="cursor-pointer text-4xl font-bold">compounder.fi</div>
      </Link>
      <div className="flex-grow"></div>

      <ConnectKitButton />
    </div>
  );
}
