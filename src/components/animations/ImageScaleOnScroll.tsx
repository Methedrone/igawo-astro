import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageScaleOnScrollProps {
  src: string;
  alt: string;
  className?: string;
  startScale?: number;
}

export default function ImageScaleOnScroll({
  src,
  alt,
  className = '',
  startScale = 0.85,
}: ImageScaleOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { scale: startScale, opacity: 0.6 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      gsap.to(image, {
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'center center',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [startScale]);

  const basePath = src.replace(/\.(jpg|jpeg|png|webp|avif)$/, '');
  const avifSrc = `${basePath}.avif`;
  const webpSrc = `${basePath}.webp`;

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <picture>
        <source srcSet={avifSrc} type="image/avif" />
        <source srcSet={webpSrc} type="image/webp" />
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover will-change-transform"
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}
