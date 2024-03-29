import { useEffect } from "react";
import ImageWithFallback from "../ImageWithFallback";

export interface PositionInformationProps {
  title: string;
  dollarValue: string;
  token0Name: string;
  token0Image: string;
  token0Qt: string;
  token1Name: string;
  token1Image: string;
  token1Qt: string;
  token0Percentage: string;
  token1Percentage: string;
}

export default function PositionInformation({
  title,
  dollarValue,
  token0Name,
  token0Image,
  token0Qt,
  token1Name,
  token1Image,
  token1Qt,
  token0Percentage,
  token1Percentage,
}: PositionInformationProps) {
  useEffect(() => {console.log(dollarValue != "NaN")}, [dollarValue]);
  return (
    <>
      {token0Image !== "" && (
        <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
          <div>{title}</div>
          <div className="mt-2 mb-4 text-3xl">{dollarValue != "NaN" ? `$${dollarValue}` : "Loading..."}</div>
          <div className="rounded-[15px] bg-gray-200 py-4 px-4">
            <div className="flex gap-4 pb-2">
              <ImageWithFallback
                alt={token0Name + " icon"}
                src={token0Image}
                width={28}
                height={28}
                fallbackSrc={
                  "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"
                }
              ></ImageWithFallback>
              <div className="">{token0Name}</div>
              <div className="flex-grow"></div>
              <div className="">{token0Qt}</div>
              {token0Percentage &&
                <div className="rounded-lg bg-gray-400 text-gray-100 p-1 text-sm">{token0Percentage}%</div>
              }
            
            </div>
            <div className="flex gap-4">
              <ImageWithFallback
                alt={token1Name + " icon"}
                src={token1Image}
                width={28}
                height={28}
                fallbackSrc={
                  "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"
                }
              ></ImageWithFallback>
              <div className="">{token1Name}</div>
              <div className="flex-grow"></div>
              <div className="">{token1Qt}</div>
              {token1Percentage &&
                <div className="rounded-lg bg-gray-400 text-gray-100 p-1 text-sm">{token1Percentage}%</div>
              }
              
            </div>
          </div>
        </div>
      )}

      {token0Image == "" && (
        <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
          <div>{title}</div>
          <div className="mt-2 mb-4 text-3xl">{dollarValue != "NaN" ? `$${dollarValue}` : "Loading..."}</div>
          <div className="rounded-[15px] bg-gray-200 py-4 px-4">
            <div className="flex items-center gap-4 pb-2">
              <div className="h-[28px] w-[28px] animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-[18px] w-[96px] animate-pulse rounded-lg bg-gray-300"></div>
              <div className="flex-grow"></div>
              <div className="h-[18px] w-[250px] animate-pulse rounded-lg bg-gray-300"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-[28px] w-[28px] animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-[18px] w-[96px] animate-pulse rounded-lg bg-gray-300"></div>
              <div className="flex-grow"></div>
              <div className="h-[18px] w-[250px] animate-pulse rounded-lg bg-gray-300"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
