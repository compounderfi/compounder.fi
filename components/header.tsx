import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="flex py-4">
      <div className="text-4xl font-bold">compounder.fi</div>
      <div className="flex-grow"></div>

      <ConnectButton
        chainStatus="none"
        showBalance={false}
        accountStatus="address"
      />
    </div>
  );
}
