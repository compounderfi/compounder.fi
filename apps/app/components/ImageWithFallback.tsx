import { FixedFormat } from "@ethersproject/bignumber";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  width,
  height,
}: ImageWithFallbackProps) {
  const [imgSrc, set_imgSrc] = useState(src);

  useEffect(() => {
    set_imgSrc(src);
  }, [src]);

  return (
    <div className="rounded-full overflow-hidden">
      <Image
        
        alt={alt}
        width={width}
        height={height}
        src={imgSrc}
        onLoadingComplete={(result) => {
          if (result.naturalWidth === 0) {
            // Broken image
            set_imgSrc(fallbackSrc);
          }
        }}
        onError={() => {
          set_imgSrc(fallbackSrc);
        }}
      />
    </div>
  );
}
