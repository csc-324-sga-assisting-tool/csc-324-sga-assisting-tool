'use client';

import {Carousel} from 'flowbite-react';
import Image from 'next/image';

export function ComponentSlide() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel>
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
          alt="..."
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
          alt="..."
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
          alt="..."
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-4.svg"
          alt="..."
        />
        <Image
          src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
          alt="..."
        />
      </Carousel>
    </div>
  );
}
