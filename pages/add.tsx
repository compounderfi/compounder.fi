import PositionGrid from "../components/positionGrid";
import { useIsMounted } from "../hooks/useIsMounted";
import { useState } from "react";

function Add() {
  const isMounted = useIsMounted();
  const [selection, setSelection] = useState<string[]>([]);
  return (
    <div>
      <p className="px-4 text-2xl font-bold">select positions to add</p>
      {isMounted && (
        <div className="mt-2">
          <PositionGrid
            selection={selection}
            setSelection={setSelection}
          ></PositionGrid>
        </div>
      )}

      {selection.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-200 py-8 px-12">
          <div className="flex">
            <p>{selection.length} positions selected</p>
            <div className="grow"></div>

            <button className="">deposit positions</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Add;
