import { createContext, useContext, useState } from 'react';

const SwapProtocolContext = createContext();

export const useSwapProtocol = () => {
  return useContext(SwapProtocolContext);
};

export const SwapProtocolProvider = ({ children }) => {
  const [selectedProtocol, setSelectedProtocol] = useState('uniswap');

  const selectUniswap = () => {
    setSelectedProtocol('uniswap');
  };

  const selectPancakeSwap = () => {
    setSelectedProtocol('pancakeswap');
  };

  const value = {
    selectedProtocol,
    selectUniswap,
    selectPancakeSwap,
  };

  return (
    <SwapProtocolContext.Provider value={value}>
      {children}
    </SwapProtocolContext.Provider>
  );
};