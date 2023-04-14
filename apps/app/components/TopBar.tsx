// src/components/TopBar.tsx
import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import TopBarDropdown from './topBarDropdown';
interface TopBarProps {
  tokenId: number;
  isCompounding: boolean;
  profitLoss: number;
  totalFees: number;
  impermanentLoss: number;
  feesAPR: number;
  ILAPR: number;
}

export default function TopBar({ tokenId, isCompounding, profitLoss, totalFees, impermanentLoss, feesAPR, ILAPR}: TopBarProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 10] } },
    ],
  })


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
          <div className='flex justify-between w-72'>
            <TopBarDropdown title='ROI' titleNumber={feesAPR - ILAPR} topTitle = "Fees" topNumber = {feesAPR} bottomTitle = "IL" bottomNumber= {ILAPR} isPercents={true} />
            <TopBarDropdown title='P/L' titleNumber={profitLoss} topTitle = "Fees" topNumber = {totalFees} bottomTitle = "IL" bottomNumber= {impermanentLoss} isPercents={false}/>
          </div>
          
          </div>
        </div>
      </div>);
}
      