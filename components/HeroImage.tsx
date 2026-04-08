'use client';

import Image from 'next/image';
import { HeroImage as HeroImageType } from './types';
import { motion } from 'framer-motion';

interface HeroImageProps {
  heroImage?: HeroImageType;
  month: number;
  year: number;
}

const defaultImages = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt: 'Mountain landscape with dramatic clouds',
    credit: 'Samuel Ferrara',
    creditUrl: 'https://unsplash.com/@samferrara'
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    alt: 'Forest path with sunlight filtering through trees',
    credit: 'David Marcu',
    creditUrl: 'https://unsplash.com/@davidmarcu'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    alt: 'Foggy mountain peaks at sunrise',
    credit: 'Luca Bravo',
    creditUrl: 'https://unsplash.com/@lucabravo'
  }
];

function getRandomDefaultImage() {
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

export default function HeroImage({ heroImage, month, year }: HeroImageProps) {
  const image = heroImage || getRandomDefaultImage();
  const date = new Date(year, month);
  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl h-full w-full shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative h-full w-full min-h-[300px] lg:min-h-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        
        <div className="absolute top-8 left-8 right-8 text-center sm:text-left drop-shadow-lg pointer-events-none z-10">
          <motion.h2 
            key={`${year}-${month}`}
            initial={{ opacity: 0, rotateX: 90, y: 20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="text-white/90 text-7xl lg:text-8xl xl:text-8xl tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-artistic)', transformOrigin: "bottom", perspective: 1000 }}
          >
            {monthName}
          </motion.h2>
          <motion.p
            key={`${year}-${month}-year`}
            initial={{ opacity: 0, rotateX: -90, y: -20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.5 }}
            className="text-white/70 text-2xl lg:text-3xl font-light tracking-widest uppercase ml-2 sm:ml-4 mt-2"
            style={{ transformOrigin: "top", perspective: 1000 }}
          >
            {year}
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
            {image.credit && (
              <>Photo by <a href={image.creditUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">{image.credit}</a></>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
