import { HomeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export interface PositionInformationProps {
  title: string;
  dollarValue: string;
  token0Name: string;
  token0Image: string;
  token0Qt: string;
  token1Name: string;
  token1Image: string;
  token1Qt: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)


export default function PositionInformation({
  title,
  dollarValue,
  token0Name,
  token0Image,
  token0Qt,
  token1Name,
  token1Image,
  token1Qt,
}: PositionInformationProps) {
  return (
    <>
    {token0Image !== "" && (
    <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
      <div>{title}</div>
      <div className="mt-2 mb-4 text-3xl">${dollarValue}</div>
      <div className="rounded-[15px] bg-gray-200 py-4 px-4">
        <div className="flex gap-4 pb-2">
          <Image
            alt={token0Name + " icon"}
            src={token0Image}
            width={28}
            layout={"fixed"}
            height={28}
            placeholder={"blur"}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(28, 28))}`}
          ></Image>
          <div className="">{token0Name}</div>
          <div className="flex-grow"></div>
          <div className="">{token0Qt}</div>
        </div>
        <div className="flex gap-4">
          <Image
            alt={token1Name + " icon"}
            src={token1Image}
            width={28}
            layout={"fixed"}
            height={28}
            placeholder={"blur"}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(28, 28))}`}
          ></Image>
          <div className="">{token1Name}</div>
          <div className="flex-grow"></div>
          <div className="">{token1Qt}</div>
        </div>
      </div>
    </div>
    )} 

    {token0Image == "" && (
    <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
      <div>{title}</div>
      <div className="mt-2 mb-4 text-3xl">${dollarValue}</div>
      <div className="rounded-[15px] bg-gray-200 py-4 px-4">
        <div className="flex gap-4 pb-2 items-center">
          <div className="w-[28px] h-[28px] bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-[64px] bg-gray-300 rounded-lg animate-pulse h-[18px]"></div>
          <div className="flex-grow"></div>
          <div className="w-[250px] bg-gray-300 rounded-lg animate-pulse h-[18px]"></div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-[28px] h-[28px] bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-[64px] bg-gray-300 rounded-lg animate-pulse h-[18px]"></div>
          <div className="flex-grow"></div>
          <div className="w-[250px] bg-gray-300 rounded-lg animate-pulse h-[18px]"></div>
        </div>
      </div>
    </div>
    )} 
    </>
  );
}
