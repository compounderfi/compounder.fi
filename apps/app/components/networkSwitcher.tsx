import { useEffect, useState } from 'react';
import { useNetwork, useSwitchNetwork, useAccount } from 'wagmi';
import ReactSelect, { ActionMeta, SingleValue } from 'react-select';

// Define the Option type
interface Option {
  value: number;
  label: string;
  logo: string;
}

const NetworkSwitcher = () => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [address]);

  const handleChange = async (option: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
    if (option && switchNetwork) {
      await switchNetwork(option.value);
    }
  };

  const formatOptionLabel = (option: Option) => (
    <div>
      <img src={option.logo} alt={option.label} style={{ width: '24px', marginRight: '8px', display: 'inline-block' }} />
      {option.label}
    </div>
  );

  const formattedChains: Option[] = chains.map((chain) => ({
    value: chain.id,
    label: chain.name,
    logo: chain.name.toLowerCase() != "arbitrum one" ? `/${chain.name.toLowerCase()}.svg` : `../arbitrum.svg`,
  }));

  const selectedOption = chain ? formattedChains.find((option) => option.value === chain.id) : null;

  return (
    <>
      {isDefinitelyConnected && (
        <>
        <div className='mr-4'>
        <ReactSelect
            name="networks"
            value={selectedOption}
            options={formattedChains}
            onChange={handleChange}
            isOptionDisabled={(option: Option) => option.value === chain?.id}
            isLoading={isLoading}
            formatOptionLabel={formatOptionLabel}
          />
        </div>
          
        </>
      )}
    </>
  );
};

export default NetworkSwitcher;
