'use client';

import { ScrollReveal } from '@/components/ui/scroll-reveal';
import Image from 'next/image';

const CULTURE_PHOTOS = [
  { src: '/brand/steadywrk-team-collab.webp', caption: 'Collaboration is how we build' },
  {
    src: '/brand/steadywrk-workspace.webp',
    caption: 'Our Amman HQ — modern workspace with a city view',
  },
  { src: '/brand/steadywrk-hero-engineer.webp', caption: 'Engineering excellence, day one' },
];

export function CultureSection() {
  return (
    <section className="py-20 md:py-32 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
            Life at STEADYWRK
          </p>
          <h2
            className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] mb-12"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Where the work happens.
          </h2>
        </ScrollReveal>

        {/* Desktop: horizontal scroll gallery */}
        <div tabIndex={0} className="flex gap-5 overflow-x-auto snap-x snap-mandatory md:pb-4 scrollbar-hide md:flex-row flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E58A0F]">
          {CULTURE_PHOTOS.map((photo, i) => (
            <ScrollReveal
              key={photo.src}
              direction={i % 2 === 0 ? 'left' : 'right'}
              delay={i * 0.1}
              className="md:min-w-[380px] md:max-w-[420px] w-full snap-center shrink-0"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 420px"
                  loading="lazy"
                />
                {/* Warm overlay */}
                <div className="absolute inset-0 bg-[#FFF8F0] mix-blend-multiply opacity-[0.08]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/80 text-[14px] font-medium">{photo.caption}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
