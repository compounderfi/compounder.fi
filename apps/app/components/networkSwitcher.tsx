import { useEffect, useState } from 'react';
import { useNetwork, useSwitchNetwork, useAccount } from 'wagmi';
import ReactSelect, {
  ActionMeta,
  SingleValue,
  StylesConfig,
  OptionProps,
  SingleValueProps,
  components,
} from 'react-select';
import Image from 'next/image'

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
  }, [address, isConnected]);

  const handleChange = async (option: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
    if (option && switchNetwork) {
      await switchNetwork(option.value);
    }
  };

  const formattedChains: Option[] = chains.map((chain) => ({
    value: chain.id,
    label: chain.name,
    logo: chain.name.toLowerCase() != "arbitrum one" ? `/${chain.name.toLowerCase()}.svg` : `/arbitrum.svg`,
  }));

  const selectedOption = chain ? formattedChains.find((option) => option.value === chain.id) : null;

  const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      borderTop: 'none',
      cursor: 'pointer',
    }),
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      paddingRight: '10px',
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '170px',
    }),
    singleValue: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
  };

  const CustomSingleValue = (props: SingleValueProps<Option, false>) => (
    <components.SingleValue {...props}>
      <Image
        src={props.data.logo}
        alt={props.data.label}
        width={24}
        height={24}
        style={{display: 'inline-block', verticalAlign: 'middle' }}
      />
    </components.SingleValue>
  );

  const CustomOption = (props: OptionProps<Option, false>) => (
    <components.Option {...props}>
      <Image
        src={props.data.logo}
        alt={props.data.label}
        width={24}
        height={24}
        style={{marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}
      />
      {props.data.label}
    </components.Option>
  );

  return (
    <>
      {isDefinitelyConnected && (
        <>
          <ReactSelect
            name="networks"
            value={selectedOption}
            options={formattedChains}
            onChange={handleChange}
            isOptionDisabled={(option: Option) => option.value === chain?.id}
            isLoading={isLoading}
            styles={customStyles}
            components={{ SingleValue: CustomSingleValue, Option: CustomOption }}
            isSearchable={false} // Disable search feature
          />
        </>
      )}
    </>
  );
};

export default NetworkSwitcher;