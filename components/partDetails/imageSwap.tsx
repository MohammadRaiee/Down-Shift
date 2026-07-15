import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
]

export function ImageSlider() {
  return (
    <Carousel className="w-full max-w-3xl">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="h-100 w-full rounded-lg object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}