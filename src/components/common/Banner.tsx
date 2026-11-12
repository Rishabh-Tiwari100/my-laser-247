import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import { cn } from '@/utils';

import { useGetBannersQuery } from '@/store/api/bannerApi';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';

interface BannerSlide {
  image: string;
  title?: string;
}

const Banner = ({ className }: { className?: string }) => {
  const { data } = useGetBannersQuery(undefined);
  const isDesktop = useDeviceWidth() >= 576;
  const group = isDesktop ? data?.data?.WebBanner : data?.data?.AppBanner;
  const apiSlides = (group?.HomeBanner ?? []).filter(
    (banner) =>
      typeof banner.image === 'string' &&
      banner.image.trim().length > 0 &&
      banner.isActive !== false &&
      banner.isPubliced !== false
  );
  const slides: BannerSlide[] = apiSlides.length
    ? apiSlides.map((banner) => ({ image: banner.image!, title: banner.heading || banner.title }))
    : [1, 2, 3].map((slide) => ({
        image: `/images/banners/${isDesktop ? '' : 'm_'}bnr${slide}.png`,
      }));

  return <BannerCarousel key={JSON.stringify(slides)} slides={slides} className={className} />;
};

const BannerCarousel = ({ slides, className }: { slides: BannerSlide[]; className?: string }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (hovered || focused || reducedMotion || slides.length < 2) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
  }, [swiper, hovered, focused, reducedMotion, slides.length]);

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
    >
      <Swiper
        modules={[A11y, Autoplay, Keyboard]}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveSlide(instance.realIndex)}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={reducedMotion ? 0 : 600}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        keyboard={{ enabled: focused, onlyInViewport: true, pageUpDown: false }}
        a11y={{ containerRoleDescriptionMessage: 'carousel', itemRoleDescriptionMessage: 'slide' }}
        className="[&_.swiper-wrapper]:ease-in-out"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} aria-hidden={index !== activeSlide}>
            <img
              className="block aspect-[18/5] w-full object-cover min-[576px]:aspect-[32/5]"
              src={slide.image}
              width={720}
              height={200}
              alt={slide.title || `Sports promotion ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        role="group"
        aria-label="Banner slides"
        className="absolute inset-x-0 bottom-[16px] z-10 hidden justify-center lg:flex"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to banner ${index + 1}`}
            aria-current={activeSlide === index ? 'true' : undefined}
            onClick={() => swiper?.slideToLoop(index)}
            className={cn(
              'mx-[3px] size-[10px] shrink-0 cursor-pointer rounded-full border-0 bg-white p-0 transition-opacity [transition-duration:600ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none',
              activeSlide === index ? 'opacity-100' : 'opacity-50'
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => swiper?.slidePrev()}
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-[12px] focus:left-[8px] focus:z-20 focus:rounded focus:bg-black/70 focus:px-[8px] focus:py-[3px] focus:text-white"
      >
        Previous banner
      </button>
      <button
        type="button"
        onClick={() => swiper?.slideNext()}
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-[12px] focus:right-[8px] focus:z-20 focus:rounded focus:bg-black/70 focus:px-[8px] focus:py-[3px] focus:text-white"
      >
        Next banner
      </button>
    </section>
  );
};

export default Banner;
