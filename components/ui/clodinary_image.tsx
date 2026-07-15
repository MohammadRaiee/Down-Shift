"use client";

import { CldImage } from "next-cloudinary";

export default function PartImage({ src }: { src: string }) {
  return (
    <CldImage
fill
      src={src}
      alt="image"
    />
  );
}