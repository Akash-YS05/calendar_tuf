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
  { // 0: January (Snow/Winter)
    src: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=800&q=80',
    alt: 'Snowy winter landscape',
    credit: 'Aaron Burden',
    creditUrl: 'https://unsplash.com/@aaronburden'
  },
  { // 1: February (Frost/Cozy)
    src: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&w=800&q=80',
    alt: 'Snowy forest road',
    credit: 'Ales Krivec',
    creditUrl: 'https://unsplash.com/@aleskrivec'
  },
  { // 2: March (Spring awakening)
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
    alt: 'Spring blossoms',
    credit: 'Arno Smit',
    creditUrl: 'https://unsplash.com/@arnosmit'
  },
  { // 3: April (Rain/Fresh)
    src: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=800&q=80',
    alt: 'Rain on window or green leaves',
    credit: 'Gabriele Diwald',
    creditUrl: 'https://unsplash.com/@gabrielediwald'
  },
  { // 4: May (Flowers)
    src: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=800&q=80',
    alt: 'Field of flowers',
    credit: 'Sergey Shmidt',
    creditUrl: 'https://unsplash.com/@sergeyshmidt'
  },
  { // 5: June (Summer nature)
    src: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=800&q=80',
    alt: 'Bright summer nature',
    credit: 'Andreas Gücklhorn',
    creditUrl: 'https://unsplash.com/@andreasgucklhorn'
  },
  { // 6: July (Beach/Ocean)
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Sunny beach',
    credit: 'Sean Oulashin',
    creditUrl: 'https://unsplash.com/@oulashin'
  },
  { // 7: August (Late summer/Sunset)
    src: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
    alt: 'Sunflower field at sunset',
    credit: 'Chris Lawko',
    creditUrl: 'https://unsplash.com/@chrislawko'
  },
  { // 8: September (Early Autumn)
    src: 'https://images.unsplash.com/photo-1444459094717-a39f1e3e0903?auto=format&fit=crop&w=800&q=80',
    alt: 'Autumn leaves',
    credit: 'Jeremy Thomas',
    creditUrl: 'https://unsplash.com/@jeremythomasphoto'
  },
  { // 9: October (Halloween/Fall colors)
    src: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=800&q=80',
    alt: 'Misty autumn forest',
    credit: 'Timothy Eberly',
    creditUrl: 'https://unsplash.com/@timothyeberly'
  },
  { // 10: November (Deep Fall/Fog)
    src: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?auto=format&fit=crop&w=800&q=80',
    alt: 'Dark moody autumn',
    credit: 'Eberhard Grossgasteiger',
    creditUrl: 'https://unsplash.com/@eberhardgross'
  },
  { // 11: December (Christmas/Snow)
    src: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80',
    alt: 'Christmas decoration or snow',
    credit: 'Kari Shea',
    creditUrl: 'https://unsplash.com/@karishea'
  }
];

function getMonthlyImage(monthIndex: number) {
  // Month is 0-11
  return defaultImages[monthIndex % 12];
}

export default function HeroImage({ heroImage, month, year }: HeroImageProps) {
  const image = heroImage || getMonthlyImage(month);
  const date = new Date(year, month);
  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      className="relative overflow-hidden rounded-[1rem] h-full w-full shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="relative h-full w-full min-h-[300px] lg:min-h-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 33vw"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 backdrop-blur-[3px]" />
        
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
