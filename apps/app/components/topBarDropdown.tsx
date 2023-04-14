// src/components/TopBar.tsx
import React, { useState } from "react";
import { usePopper } from "react-popper";

interface TopBarProps {
  title: string;
  titleNumber: number;
  topTitle: string;
  topNumber: number;
  bottomTitle: string;
  bottomNumber: number;
  isPercents?: boolean;
}

export default function TopBarDropdown({
  title,
  titleNumber,
  topTitle,
  topNumber,
  bottomTitle,
  bottomNumber,
  isPercents
}: TopBarProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [0, 10] } },
    ],
  });

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  return (
    <div className="flex items-center text-lg font-semibold">
      <span>{title}: </span>
      <button
        ref={setReferenceElement}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center"
      >
        {titleNumber ? (
          <>
            <span
              className={`${titleNumber >= 0 ? "text-[#81e291]" : "text-[#fa0079]"} ml-1 cursor-pointer`}
            >
              {titleNumber >= 0 ? "+" : "-"}{!isPercents && "$"}{Math.abs(titleNumber).toFixed(2)}{isPercents && "%"}
            </span>
            <svg
              className="ml-1 h-4 w-4 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42l3.3 3.3z" />
            </svg>
          </>
        ) : (
          <span className="ml-1">Loading...</span>
        )}
      </button>
      {showMenu && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="rounded border border-gray-300 bg-white px-4 py-2 shadow-xl"
        >
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="pb-1">{topTitle}:</td>
                <td className="pb-1 text-right text-[#81e291]">{!isPercents && "$"}{topNumber.toFixed(2)}{isPercents && "%"}</td>
              </tr>
              <tr>
                <td className="pb-1">{bottomTitle}:</td>
                <td className="pb-1 text-right text-[#fa0079]">-{!isPercents && "$"}{bottomNumber.toFixed(2)}{isPercents && "%"}</td>
              </tr>
              <tr>
                <td className="border-t border-gray-300 pt-1">{title}:</td>
                <td className={`${titleNumber >= 0 ? "text-[#81e291]" : "text-[#fa0079]"} border-t border-gray-300 pt-1 text-right`}>
                {!isPercents && "$"}{(topNumber - bottomNumber).toFixed(2)}{isPercents && "%"}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className="popper__arrow"
          />
        </div>
      )}
    </div>
  );
}
