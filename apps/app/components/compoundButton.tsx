import { Row } from "@tanstack/react-table";
import { Position } from "./tables/positions";
import { useEffect, useState} from "react";
import CompoundNowModal from "./compoundNowModal";

export interface CompoundButtonProps {
  tokenID: string,
  row: Row<Position>,
  apiRequest: any
}

export default function CompoundButton({ tokenID, row, apiRequest }: CompoundButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const response = apiRequest["apiResponse"]
  const bgColor = row.index % 2 === 0 ? "bg-gray-200" : "bg-gray-200";

  return (
    <>
    <button
      onClick={() => setDialogIsOpen(true)}
      className=" my-2 rounded-lg bg-[#81e291] px-2 transition-colors duration-300 hover:bg-[#92D5E6]"
    >
      compound now
    </button>
    <CompoundNowModal
        token0={response.symbol0}
        token1={response.symbol1}
        token0UnclaimedInUSD={Number(response.token0UnclaimedInUSD)}
        token1UnclaimedInUSD={Number(response.token1UnclaimedInUSD)}
        positionId={tokenID}
        setIsOpen={setDialogIsOpen}
        isOpen={dialogIsOpen}
        isCompounding = {true}
      ></CompoundNowModal>
    </>
    
  );
}
