// src/components/ProtocolSwitcher.js
import React, { useEffect } from "react";
import { useSwapProtocol } from "../context/SwapProtocolContext";
import ReactSelect, {
  ActionMeta,
  SingleValue,
  StylesConfig,
  OptionProps,
  SingleValueProps,
  components,
} from "react-select";

// Define the Option type
interface Option {
  value: string;
  label: string;
  logo: string;
}

const ProtocolSwitcher = () => {
  const { selectedProtocol, selectUniswap, selectPancakeSwap } =
    useSwapProtocol();

  const handleChange = (
    option: SingleValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    if (option) {
      if (option.value === "uniswap") {
        selectUniswap();
      } else if (option.value === "pancakeswap") {
        selectPancakeSwap();
      }
    }
  };

  const protocols = [
    { value: "uniswap", label: "Uniswap", logo: "/uniswap.svg" },
    { value: "pancakeswap", label: "PancakeSwap (SOON)", logo: "/pancakeswap.svg" }
  ];

  const selectedOption = selectedProtocol ? protocols.find((option) => option.value === selectedProtocol) : null;

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

  const CustomSingleValue = (props: SingleValueProps<Option, false>) => {
    const data = props.data || protocols[0]; // Default to the first protocol in the list
    return (
      <components.SingleValue {...props}>
        <img
          src={data.logo}
          alt={data.label}
          style={{ width: '24px', display: 'inline-block', verticalAlign: 'middle' }}
        />
      </components.SingleValue>
    );
  };

  const CustomOption = (props: OptionProps<Option, false>) => (
    <components.Option {...props}>
      <img
        src={props.data.logo}
        alt={props.data.label}
        style={{
          width: "24px",
          marginRight: "8px",
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
      {props.data.label}
    </components.Option>
  );

  return (

    <ReactSelect
            name="protocols"
            value={selectedOption}
            options={protocols}
            onChange={handleChange}
            isOptionDisabled={(option: Option) => option.value === selectedOption?.value}
            styles={customStyles}
            components={{ SingleValue: CustomSingleValue, Option: CustomOption }}
            isSearchable={false} // Disable search feature
          />
  );
};

export default ProtocolSwitcher;
