import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import Image from "next/image";

const uniswapAbi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
];

export interface NFTPreviewProps {
  id: string;
}

export default function NFTPreview({ id }: NFTPreviewProps) {
  const [tokenImage, setTokenImage] = useState("");

  const { data } = useContractRead({
    addressOrName: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    contractInterface: uniswapAbi,
    functionName: "tokenURI",
    args: id,
    chainId: 5,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const tokenData = JSON.parse(
      Buffer.from(data.split(",", 2)[1], "base64").toString()
    );
    setTokenImage(tokenData["image"]);
  }, [data]);
  return (
    <Image
      height="700px"
      width="500px"
      alt={"Token #" + id}
      src={tokenImage}
    ></Image>
  );
}
