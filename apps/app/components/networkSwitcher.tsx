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

  const formattedChains: Option[] = chains.map((chain) => ({
    value: chain.id,
    label: chain.name,
    logo: chain.name.toLowerCase() != "arbitrum one" ? `/${chain.name.toLowerCase()}.svg` : `../arbitrum.svg`,
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
      justifyContent: 'space-between',
      paddingRight: '10px',
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '180px',
    }),
    singleValue: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
  };

  const CustomSingleValue = (props: SingleValueProps<Option, false>) => (
    <components.SingleValue {...props}>
      <img
        src={props.data.logo}
        alt={props.data.label}
        style={{ width: '24px', display: 'inline-block', verticalAlign: 'middle' }}
      />
    </components.SingleValue>
  );

  const CustomOption = (props: OptionProps<Option, false>) => (
    <components.Option {...props}>
      <img
        src={props.data.logo}
        alt={props.data.label}
        style={{ width: '24px', marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}
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