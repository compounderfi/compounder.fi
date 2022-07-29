import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="flex py-4">
      <div className="text-4xl">compounder.fi</div>
      <div className="flex-grow"></div>

      <ConnectButton
        chainStatus="none"
        showBalance={false}
        accountStatus="address"
      />
    </div>
  );
}
