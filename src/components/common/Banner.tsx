import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

const slides = [1, 2, 3];
const loopSlides = [3, ...slides, 1];
const positions = [
  'translate-x-0',
  '-translate-x-full',
  '-translate-x-[200%]',
  '-translate-x-[300%]',
  '-translate-x-[400%]',
];

const Banner = ({ className }: { className?: string }) => {
  const [position, setPosition] = useState(1);
  const [animated, setAnimated] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const frames = useRef<number[]>([]);
  const activeSlide = (position - 1 + slides.length) % slides.length;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    if (hovered || focused || reducedMotion) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible')
        setPosition((current) => Math.min(current + 1, 4));
    }, 5000);
    return () => window.clearInterval(interval);
  }, [hovered, focused, reducedMotion]);

  useEffect(() => () => frames.current.forEach((frame) => window.cancelAnimationFrame(frame)), []);

  useEffect(() => {
    setAnimated(!reducedMotion);
    if (reducedMotion)
      setPosition((current) => ((current - 1 + slides.length) % slides.length) + 1);
  }, [reducedMotion]);

  const finishTransition = () => {
    if (position !== 0 && position !== 4) return;
    setAnimated(false);
    setPosition(position === 0 ? 3 : 1);
    frames.current = [
      window.requestAnimationFrame(() => {
        frames.current = [
          window.requestAnimationFrame(() => {
            setAnimated(true);
            frames.current = [];
          }),
        ];
      }),
    ];
  };

  const move = (direction: number) => {
    if (reducedMotion) {
      setAnimated(false);
      setPosition(((activeSlide + direction + slides.length) % slides.length) + 1);
    } else {
      setPosition((current) => Math.max(0, Math.min(4, current + direction)));
    }
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Sports promotions"
      className={cn('relative my-[5px] overflow-hidden', className)}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setHovered(false);
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const start = touchStart.current;
        touchStart.current = null;
        if (!touch || !start) return;
        const delta = touch.clientX - start.x;
        if (Math.abs(delta) > 40 && Math.abs(delta) > Math.abs(touch.clientY - start.y))
          move(delta < 0 ? 1 : -1);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
    >
      <div
        className={cn(
          'flex touch-pan-y will-change-transform',
          positions[position],
          animated && !reducedMotion
            ? 'transition-transform duration-[600ms] ease-in-out'
            : 'transition-none'
        )}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'transform')
            finishTransition();
        }}
      >
        {loopSlides.map((slide, index) => (
          <picture
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Promotion ${slide} of ${slides.length}`}
            aria-hidden={index !== position}
            className="block w-full shrink-0"
          >
            <source
              media="(min-width: 576px)"
              srcSet={`/images/banners/bnr${slide}.png`}
              width={1920}
              height={300}
            />
            <img
              className="block aspect-[18/5] w-full object-cover sm:aspect-[32/5]"
              src={`/images/banners/m_bnr${slide}.png`}
              width={720}
              height={200}
              alt={`Sports promotion ${slide}`}
              loading={index === 1 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </picture>
        ))}
      </div>
      <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:inset-x-0 focus-within:bottom-[4px] focus-within:flex focus-within:justify-center focus-within:gap-[8px]">
        <button
          type="button"
          onClick={() => move(-1)}
          className="rounded bg-black/70 px-[8px] py-[3px] text-white"
        >
          Previous banner
        </button>
        {slides.map((slide, index) => (
          <button
            key={slide}
            type="button"
            aria-label={`Go to banner ${slide}`}
            aria-current={activeSlide === index ? 'true' : undefined}
            onClick={() => setPosition(slide)}
            className="rounded bg-black/70 px-[8px] py-[3px] text-white"
          >
            {slide}
          </button>
        ))}
        <button
          type="button"
          onClick={() => move(1)}
          className="rounded bg-black/70 px-[8px] py-[3px] text-white"
        >
          Next banner
        </button>
      </div>
    </section>
  );
};

export default Banner;
