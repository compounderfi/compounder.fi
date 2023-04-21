import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";
import ConnectKitButton from "../components/cards/ConnectWalletButton";
import NetworkSwitcher from "./networkSwitcher";
import ProtocolSwitcher from "./ProtocolSwitcher";
export default function Header() {
  const { address } = useAccount();

  return (
    <div className="flex px-4 py-4">
      <Link href={address ? "/positions/" + address : "/"}>
        <div className="flex gap-2 ">
          <Image
            alt="compounder.fi logo"
            width={40}
            height={40}
            src="/faviconlightmode.ico"
          ></Image>
          <div className="cursor-pointer text-4xl font-bold">compounder.fi</div>
        </div>
      </Link>
      <div className="flex-grow"></div>
      <div className="flex space-between">
        <NetworkSwitcher />
        <ProtocolSwitcher />
        <ConnectKitButton />
      </div>

    </div>
  );
}
