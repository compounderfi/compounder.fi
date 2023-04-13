// src/components/TopBar.tsx
import React from 'react';

interface TopBarProps {
  tokenId: number;
  isCompounding: boolean;
  profitLoss: number;
}

export default function TopBar({ tokenId, isCompounding, profitLoss }: TopBarProps) {
  return (
    <div className="border-b border-gray-200 my-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-6xl font-bold">{tokenId}</span>
            <span
              className={`ml-2 px-2 py-1 text-sm font-semibold uppercase rounded ${
                isCompounding ? 'bg-[#81e291] text-white' : 'bg-[#fa0079] '
              }`}
            >
              {isCompounding ? 'Compounding' : 'Not compounding'}
            </span>
          </div>
          <div className="text- font-semibold">
            <span>P/L: </span>
            <span className={`text-${profitLoss >= 0 ? 'green' : 'red'}-600`}>
              {profitLoss >= 0 ? '+' : '-'}${Math.abs(profitLoss).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}