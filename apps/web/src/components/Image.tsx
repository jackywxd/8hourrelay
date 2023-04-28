import type { HTMLProps } from "react";
import NextImage from "next/image";

export function Image({
  src: relativePath,
  alt,
  height,
  width,
}: HTMLProps<HTMLImageElement>) {
  return (
    <NextImage
      src={`${relativePath}`}
      alt={alt}
      // These are dynamically provided at build-time by `rehypeImageSize`
      height={height}
      width={width}
    />
  );
}
