import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Header() {
  const { address } = useAccount();

  return (
    <div className="flex px-4 py-4">
      <Link href={address ? "/positions/" + address : "/"}>
        <div className="cursor-pointer text-4xl font-bold">compounder.fi</div>
      </Link>
      <div className="flex-grow"></div>

      <ConnectKitButton />
    </div>
  );
}
