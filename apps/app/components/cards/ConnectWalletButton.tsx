import { ConnectKitButton } from "connectkit";

const ConnectWalletButton = () => {
    return (
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            !isConnected ? (
              <button onClick={show} className=" my-1 rounded-lg bg-[#81e291] px-2 transition-colors duration-300 hover:bg-[#92D5E6]">
              {isConnected ? ensName ?? truncatedAddress : "connect wallet"}
            </button>
            ) :
            (<ConnectKitButton></ConnectKitButton>)
            
          );
        }}
      </ConnectKitButton.Custom>
    );
  };
  
export default ConnectWalletButton;