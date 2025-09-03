import React from 'react';
import CollectionCard from './CollectionCard';
import { popularCollections } from '@/utils/collections';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Collections: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-white px-4 md:px-12">Popular Collections</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 px-4 md:px-12">
          {popularCollections.map((collection) => (
            <CarouselItem key={collection.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <CollectionCard collection={collection} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-6 md:left-16 bg-black/50 text-white border-none hover:bg-black/70" />
        <CarouselNext className="right-6 md:right-16 bg-black/50 text-white border-none hover:bg-black/70" />
      </Carousel>
    </div>
  );
};

export default Collections;
