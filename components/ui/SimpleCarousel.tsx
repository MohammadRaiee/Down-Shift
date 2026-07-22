"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
const images = [
  "/acfef7d86efdb6bd04865832c2db1980.jpg",
  "/haha.webp",
  "/Untitled design (2).png",
    "/Dodge.jpg",
  "/haha.webp",
  "/Untitled design (2).png",
    "/Dodge.jpg",
  "/haha.webp",
  "/Untitled design (2).png",
    "/Dodge.jpg",
  "/haha.webp",
  "/Untitled design (2).png",
];

const slides =
  images.length === 0
    ? ([] as string[])
    : [images[images.length - 1], ...images, images[0]];

export default function SimpleCarousel() {
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const next = useCallback(
    () => {
      if (slides.length === 0) {
        return;
      }
      setIsTransitioning(true);
      setIndex((i) => i + 1);
    },
    []
  );
  const prev = useCallback(
    () => {
      if (slides.length === 0) {
        return;
      }
      setIsTransitioning(true);
      setIndex((i) => i - 1);
    },
    []
  );

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  if (slides.length === 0) {
    return null;
  }

  const activeIndex = (index - 1 + images.length) % images.length;

  return (
    <div className="relative max-w-180 w-[85%] lg:w-1/2 h-100 overflow-hidden rounded-2xl">
      <div
        className={` flex h-full w-full ${
          isTransitioning
            ? "transition-transform duration-500 ease-out"
            : "transition-none"
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={() => {
          console.log("index:", index , "slides length:", slides.length);
          if (index >= slides.length - 1) {
            console.log("Transition ended at last slide, resetting to first slide.");
            setIsTransitioning(false);
            setIndex(1);
          } else if (index === 0) {
            console.log("Transition ended at first slide, resetting to last slide.");
            setIsTransitioning(false);
            setIndex(slides.length - 2);
          }
        }}
      >
        {slides.map((src, i) => {
          // console.log(src, i , isTransitioning); ;
        return (  <div key={`${src}-${i}`} className="relative h-full w-full flex-shrink-0">
            <Image
              src={src}
              alt={`Slide ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        )})}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white"
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsTransitioning(true);
              setIndex(i + 1);
            }}
            className={`h-2 w-2 rounded-full ${
              i === activeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}