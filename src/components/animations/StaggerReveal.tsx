import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  stagger?: number;
  duration?: number;
  y?: number;
}

export default function StaggerReveal({
  children,
  className = '',
  stagger = 0.1,
  duration = 0.7,
  y = 30,
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const children = el.children;
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.from(children, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, duration, y]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
