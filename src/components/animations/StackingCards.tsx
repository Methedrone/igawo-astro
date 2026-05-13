import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StackingCardsProps {
  children: ReactNode;
  className?: string;
  cardSelector?: string;
}

export default function StackingCards({
  children,
  className = '',
  cardSelector = '.stack-card',
}: StackingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = el.querySelectorAll(cardSelector);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      const triggers: ScrollTrigger[] = [];

      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;
        if (isLast) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 15%',
            end: 'bottom 15%',
            scrub: 1,
            pin: true,
            pinSpacing: false,
            onEnter: () => {
              gsap.to(card, { scale: 0.95, filter: 'brightness(0.85)', duration: 0.3 });
            },
            onLeaveBack: () => {
              gsap.to(card, { scale: 1, filter: 'brightness(1)', duration: 0.3 });
            },
          },
        });

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      });

      return () => {
        triggers.forEach((st) => st.kill());
      };
    }, el);

    return () => ctx.revert();
  }, [cardSelector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
