import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetBannersQuery } from '@/store/api/bannerApi';
import type { RootState } from '@/store';
import 'swiper/css';
import 'swiper/css/pagination';

export default function CasinoBannerSlider() {
  const { isLoading } = useGetBannersQuery(undefined);
  const banners = useSelector((state: RootState) => state.banner.banners);

  const slides = useMemo(() => {
    const webBanners = banners.WebBanner ?? {};
    const casinoBanners = webBanners?.PromotionBanner ?? [];
    return casinoBanners;
  }, [banners.WebBanner]);

  if (isLoading && slides.length === 0) {
    return <div className="mb-[3px] h-[86px] animate-pulse bg-[#20384d] md:h-[162px]" />;
  }

  return (
    <section className="mb-[3px] overflow-hidden bg-[#071427]" aria-label="Casino promotions">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="casino-banner-slider"
      >
        {slides.map((banner, index) => (
          <SwiperSlide key={index}>
            <img
              src={banner.image || '/images/banners/kv-all-casino-m.webp'}
              alt={banner.heading || banner.title || 'Casino promotion'}
              className="block h-[86px] w-full object-cover md:h-[162px]"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(event) => {
                event.currentTarget.src = '/images/banners/kv-all-casino-m.webp';
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
