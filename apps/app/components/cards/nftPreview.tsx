import { useRef, useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import Image from "next/image";
import { NFPM_ADDRESS } from "../../utils/constants";
import { useNetwork } from "wagmi";
const uniswapAbi = [
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
];

function getSnapshot(
  src: HTMLImageElement,
  canvas: HTMLCanvasElement,
  targetHeight: number
) {
  const context = canvas.getContext("2d");

  if (context) {
    let { width, height } = src;

    // src may be hidden and not have the target dimensions
    const ratio = width / height;
    height = targetHeight;
    width = Math.round(ratio * targetHeight);

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    context.scale(devicePixelRatio, devicePixelRatio);

    context.clearRect(0, 0, width, height);
    context.drawImage(src, 0, 0, width, height);
  }
}

export interface NFTPreviewProps {
  id: string;
  chainId: number;
}

export default function NFTPreviewProps({ id, chainId}: NFTPreviewProps) {
  const [tokenImage, setTokenImage] = useState("");
  const [animate, setAnimate] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { data } = useContractRead({
    address: NFPM_ADDRESS,
    abi: uniswapAbi,
    functionName: "tokenURI",
    args: [id],
    chainId: chainId,
  });

  useEffect(() => {
    if (data) {
      const tokenData = JSON.parse(
        Buffer.from((data as String).split(",", 2)[1], "base64").toString()
      );
      setTokenImage(tokenData["image"]);
    }
  }, [data]);

  return (
    <div
      className="grid h-[386px] w-[224px]"
      style={{ gridTemplate: "overlap" }}
      // onMouseEnter={() => {
      //   // setAnimate(true);
      // }}
      // onMouseLeave={() => {
      //   // snapshot the current frame so the transition to the canvas is smooth
      //   if (imageRef.current && canvasRef.current) {
      //     getSnapshot(
      //       // @ts-ignore
      //       imageRef.current.firstChild.children[1],
      //       canvasRef.current,
      //       386
      //     );
      //   }
      //   setAnimate(false);
      // }}
    >
      <canvas
        ref={canvasRef}
        className="h-[386px] w-[224px]"
        style={{ gridArea: "overlap" }}
      ></canvas>
      <div
        className="z-10 h-[386px] w-[224px]"
        style={{ gridArea: "overlap" }}
        ref={imageRef}
        hidden={!animate}
      >
        <Image
          height="386"
          width="224"
          alt={"Token #" + id}
          src={tokenImage}
          onLoad={() => {
            // snapshot for the canvas
            if (imageRef.current && canvasRef.current) {
              getSnapshot(
                // @ts-ignore
                imageRef.current.firstChild,
                canvasRef.current,
                386
              );
            }
          }}
        ></Image>
      </div>
    </div>
  );
}
