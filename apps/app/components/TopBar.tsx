// src/components/TopBar.tsx
import React, { useRef } from 'react';
import { usePopper } from 'react-popper';

interface TopBarProps {
  tokenId: number;
  isCompounding: boolean;
  profitLoss: number;
  totalFees: number;
  impermanentLoss: number;
}

export default function TopBar({ tokenId, isCompounding, profitLoss, totalFees, impermanentLoss }: TopBarProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const referenceElement = useRef(null);
  const popperElement = useRef(null);
  const arrowElement = useRef(null);
  const { styles, attributes } = usePopper(referenceElement.current, popperElement.current, {
    placement: 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement.current } },
      { name: 'offset', options: { offset: [0, 10] } },
    ],
  });

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  return (
    <div className="border-b border-gray-200 my-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-6xl font-bold">{tokenId}</span>
            <span
              className={`ml-2 px-2 py-1 text-sm font-semibold uppercase rounded ${
                isCompounding ? 'bg-[#81e291] text-white' : 'bg-[#fa0079] text-white'
              }`}
            >
              {isCompounding ? 'Compounding' : 'Not compounding'}
            </span>
          </div>
          <div className="text-lg font-semibold flex items-center">
            <span>P/L: </span>
            <span
              ref={referenceElement}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex items-center"
            >
              <span className={`text-${profitLoss >= 0 ? 'green' : 'red'}-600 ml-1 underline-dotted cursor-pointer`}>
                {profitLoss >= 0 ? '+' : '-'}${Math.abs(profitLoss).toFixed(2)}
              </span>
              <svg
                className="w-4 h-4 ml-1 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42l3.3 3.3z" />
              </svg>
            </span>
            {showMenu && (
              <div
                ref={popperElement}
                style={styles.popper}
                {...attributes.popper}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="bg-white border border-gray-300 rounded shadow-xl px-4 py-2"
                >
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="pb-1">Fees:</td>
                        <td className="pb-1 text-right">${totalFees.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="pb-1">IL:</td>
                        <td className="pb-1 text-right">-${impermanentLoss.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="border-t border-gray-300 pt-1">P/L:</td>
                        <td className="border-t border-gray-300 pt-1 text-right">
                          ${(totalFees - impermanentLoss).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div ref={arrowElement} style={styles.arrow} className="popper__arrow" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>);
}
      