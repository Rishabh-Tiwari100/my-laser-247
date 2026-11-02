import { useAppSelector } from '@/hooks';
import { useGetBannersQuery } from '@/store/api/bannerApi';
import { RootState } from '@reduxjs/toolkit/query';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const Banner = () => {
  const { isLoading } = useGetBannersQuery(undefined);
  const banners = useAppSelector((state) => state.banner.banners);

  const slides = useMemo(() => {
    const webBanners = banners.WebBanner ?? {};
    const homeBanners = webBanners?.HomeBanner ?? [];
    return homeBanners;
  }, [banners.WebBanner]);

  if (isLoading && slides.length === 0) {
    return <div className="mb-[3px] h-[86px] animate-pulse bg-[#20384d] md:h-[162px]" />;
  }

  return (
    <div className="my-[5px]">
      <img
        className="h-[66px] lg:h-[250px] max-w-full w-full"
        // src="/images/home-images/main-banner.gif"
        src={slides[0]?.image || '/images/home-images/main-banner.gif'}
        alt=""
      />
    </div>
  );
};

export default Banner;
