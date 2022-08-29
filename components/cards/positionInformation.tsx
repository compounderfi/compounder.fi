import Image from "next/image";

export interface PositionInformationProps {
  title: string;
  dollarValue: string;
  token1Name: string;
  token1Image: string;
  token1Qt: string;
  token2Name: string;
  token2Image: string;
  token2Qt: string;
}

export default function PositionInformation({
  title,
  dollarValue,
  token1Name,
  token1Image,
  token1Qt,
  token2Name,
  token2Image,
  token2Qt,
}: PositionInformationProps) {
  return (
    <div className="rounded-[30px] border-2 border-gray-200 bg-[#f0f2f5] p-6 shadow-lg">
      <div>{title}</div>
      <div className="mt-2 mb-4 text-3xl">${dollarValue}</div>
      <div className="rounded-[15px] bg-gray-200 py-4 px-4">
        <div className="flex gap-4 pb-2">
          <Image
            alt={token1Name + " icon"}
            src={token1Image}
            width={28}
            layout={"fixed"}
            height={28}
          ></Image>
          <div className="">{token1Name}</div>
          <div className="flex-grow"></div>
          <div className="">{token1Qt}</div>
        </div>
        <div className="flex gap-4">
          <Image
            alt={token2Name + " icon"}
            src={token2Image}
            width={28}
            layout={"fixed"}
            height={28}
          ></Image>
          <div className="">{token2Name}</div>
          <div className="flex-grow"></div>
          <div className="">{token2Qt}</div>
        </div>
      </div>
    </div>
  );
}
