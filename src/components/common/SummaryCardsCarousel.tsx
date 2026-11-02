import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import SummaryCard, { SummaryCardItem } from './SummaryCard';
import { cn } from '@/utils';

interface Props {
  data: SummaryCardItem[];
  view?: 'horizontal' | 'vertical';
  className?: string;
}

const SummaryCardsCarousel: React.FC<Props> = ({ data, view = 'horizontal', className }) => {
  console.log('item', data);
  if (view === 'vertical') {
    return (
      <div className={cn('grid grid-flow-row gap-3 my-2', className)}>
        {data.map((item, index) => (
          <SummaryCard key={index} item={item} />
        ))}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1.1}
      breakpoints={{
        330: { slidesPerView: 1 },
        640: { slidesPerView: Math.min(2, data.length) },
        768: { slidesPerView: Math.min(3, data.length) },
        1024: { slidesPerView: Math.min(3, data.length) },
        1480: { slidesPerView: Math.min(4, data.length) },
      }}
      className={cn('swiper-pagination-custom', className)}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index}>
          <SummaryCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SummaryCardsCarousel;
