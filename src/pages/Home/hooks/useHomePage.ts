import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import { useDeviceWidth } from '@/hooks/useDeviceWidth';
import { useIsAuthenticated } from '@/hooks';
import { useGetCasinoStaticGamesQuery } from '@/store/api/casinoHomePageApi';
import { CASINO_IMAGES, WebHomeBannerFallback } from '@/utils/constants/home';
import { useGetBannersQuery } from '@/store/api/bannerApi';

const pickBanners = (src: any, key: string) =>
  src?.[key]?.map((b: any) => ({ type: b.type, image: b.image, link: b.link })) || [];

const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const buildCasinoCategory = (
  title: string,
  apiGames: { id: number; name: string }[] = []
) => {
  const images = CASINO_IMAGES[title] || [];

  return {
    title,
    games: images.map((img) => {
      const matchedGame = apiGames.find((g) => normalize(g.name) === img.key);

      return {
        id: matchedGame?.id ?? null,
        name: matchedGame?.name ?? '',
        image: img.image,
        isVideo: img.isVideo,
      };
    }),
  };
};

export function useHomePage() {
  const { isLoading: isBannersLoading } = useGetBannersQuery(undefined);
  const width = useDeviceWidth();
  const isAuthenticated = useIsAuthenticated();

  // show Welcome Banner only once
  const banners = useSelector((state: RootState) => state.banner.banners);

  //banner groups
  const { AppBanner, WebBanner } = banners;
  const webHomeBannerImages = [
    { image: '/images/banners/kv-all-game-m.webp', type: 'HomeBanner' },
    { image: '/images/banners/kv-all-casino-m.webp', type: 'HomeBanner' },
    { image: '/images/banners/kv-all-cricket-m.webp', type: 'HomeBanner' },
    { image: '/images/banners/kv-all-soccer-m.webp', type: 'HomeBanner' },
    { image: '/images/banners/kv-all-tennis-m.webp', type: 'HomeBanner' },
  ];
  // const webHomeBannerImages = pickBanners(WebBanner, 'HomeBanner');
  const appHomeBannerImages = pickBanners(AppBanner, 'HomeBanner');

  const webWelcomeBannerImages = pickBanners(WebBanner, 'WellcomeBanner');
  const appWelcomeBannerImages = pickBanners(AppBanner, 'WellcomeBanner');

  // home banner
  const displayHomeBanner = useMemo(() => {
    if (isBannersLoading) return [];
    // if (width <= 768) {
    // return appHomeBannerImages.length > 0 ? appHomeBannerImages : AppHomeBannerFallback;
    // }
    return webHomeBannerImages.length > 0 ? webHomeBannerImages : WebHomeBannerFallback;
  }, [width, appHomeBannerImages, webHomeBannerImages, isBannersLoading]);

  // welcome banner
  const displayWelcomeBanner = useMemo(() => {
    if (isBannersLoading) return [];
    if (width <= 768) {
      return appWelcomeBannerImages.length ? appWelcomeBannerImages : webWelcomeBannerImages;
    }
    return webWelcomeBannerImages.length ? webWelcomeBannerImages : appWelcomeBannerImages;
  }, [width, appWelcomeBannerImages, webWelcomeBannerImages, isBannersLoading]);

  // API Calls
  // const { data: staticCasinoGames, isLoading: staticCasinoLoading } =
  //   useGetCasinoStaticGamesQuery();

  // const finalCasinoData = useMemo(() => {
  //   return staticCasinoGames?.games?.map((category) => ({
  //     ...buildCasinoCategory(category.title, category.games),
  //     isLoading: staticCasinoLoading,
  //   }));
  // }, [staticCasinoGames, staticCasinoLoading]);
  // console.log('finalCasinoData', finalCasinoData);
  // console.log('staticCasinoGames', staticCasinoGames);
  const baseUrl = '/images/home-images/';
  const homeImages = [
    {
      image: `${baseUrl}banner_bdbet_sports.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Sports',
      enableFooter: true,
    },
    {
      image: `${baseUrl}1.webp`,
      type: 'halfWidth',
      link: '/',
      name: '',
      enableFooter: false,
    },
    {
      image: `${baseUrl}Live-Casino-Lobby.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Live Casino Lobby',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KINGMAKER.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'KINGMAKER',
      enableFooter: true,
    },
    {
      image: `${baseUrl}1.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Quizs',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Royal-Gaming.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Royal Gaming',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Acewin.webp`,
      type: 'square',
      link: '/',
      name: 'Acewin',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Hacksaw.webp`,
      type: 'square',
      link: '/',
      name: 'Hacksaw',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Octoplay.webp`,
      type: 'square',
      link: '/',
      name: 'Octoplay',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Pinnacle.webp`,
      type: 'square',
      link: '/',
      name: 'Pinnacle',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Play8.webp`,
      type: 'square',
      link: '/',
      name: 'Play8',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PlaynGo.webp`,
      type: 'square',
      link: '/',
      name: 'PlaynGo',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Relax.webp`,
      type: 'square',
      link: '/',
      name: 'Relax',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Smartsoft.webp`,
      type: 'square',
      link: '/',
      name: 'Smartsoft',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Viacasino.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Viacasino',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Winfinity.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Winfinity',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Aviator.webp`,
      type: 'square',
      link: '/',
      name: 'Aviator',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Aviatrix.webp`,
      type: 'square',
      link: '/',
      name: 'Aviatrix',
      enableFooter: true,
    },
    {
      image: `${baseUrl}betgames.webp`,
      type: 'square',
      link: '/',
      name: 'Betgames',
      enableFooter: true,
    },
    {
      image: `${baseUrl}HOTROAD-LIVE-002.webp`,
      type: 'square',
      link: '/',
      name: 'Roulette',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Sexy.webp`,
      type: 'square',
      link: '/',
      name: 'Sexy',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Ezugi-Casino.webp`,
      type: 'square',
      link: '/',
      name: 'Ezugi Casino',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Evolution.webp`,
      type: 'square',
      link: '/',
      name: 'Evolution',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-027.webp`,
      type: 'square',
      link: '/',
      name: 'European Roulette',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Ludo.webp`,
      type: 'halfWidth',
      link: '/',
      name: 'Ludo',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-050.webp`,
      type: 'square',
      link: '/',
      name: 'Color Game',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-015.webp`,
      type: 'square',
      link: '/',
      name: 'SicBo',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-028.webp`,
      type: 'square',
      link: '/',
      name: '7 Up Down',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-036.webp`,
      type: 'square',
      link: '/',
      name: 'Coin Toss',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-017.webp`,
      type: 'square',
      link: '/',
      name: 'Tai Xiu',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-039.webp`,
      type: 'square',
      link: '/',
      name: '32 Cards',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-022.webp`,
      type: 'square',
      link: '/',
      name: 'Card Matka',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-021.webp`,
      type: 'square',
      link: '/',
      name: 'Number Matka',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-032.webp`,
      type: 'square',
      link: '/',
      name: 'Andar Bahar',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-038.webp`,
      type: 'square',
      link: '/',
      name: 'Blackjack',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-027.webp`,
      type: 'square',
      link: '/',
      name: 'European Roulette',
      enableFooter: true,
    },
    {
      image: `${baseUrl}KM-TABLE-034.webp`,
      type: 'square',
      link: '/',
      name: 'Pok Deng',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-SLOT-086.webp`,
      type: 'square',
      link: '/',
      name: 'Egyptian Fortunes',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Sexy-Baccarat.webp`,
      type: 'square',
      link: '/',
      name: 'Sexy Baccarat',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-LIVE-039.webp`,
      type: 'square',
      link: '/',
      name: 'Mega Roulette',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JDB.webp`,
      type: 'square',
      link: '/',
      name: 'JDB',
      enableFooter: true,
    },
    {
      image: `${baseUrl}SG-EGAME-001.webp`,
      type: 'square',
      link: '/',
      name: 'Derby Express',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Lucky-6.webp`,
      type: 'square',
      link: '/',
      name: 'Lucky 6',
      enableFooter: true,
    },
    {
      image: `${baseUrl}Lucky-7.webp`,
      type: 'square',
      link: '/',
      name: 'Lucky 7',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PT-SLOT-167.webp`,
      type: 'square',
      link: '/',
      name: 'Fire Blaze: Red Wizard',
      enableFooter: true,
    },
    {
      image: `${baseUrl}NETENT-SLOT-001.webp`,
      type: 'square',
      link: '/',
      name: 'Reel Rush',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-LIVE-026.webp`,
      type: 'square',
      link: '/',
      name: 'Auto Roulette',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-LIVE-044.webp`,
      type: 'square',
      link: '/',
      name: 'Sweet Bonanza',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-LIVE-035.webp`,
      type: 'square',
      link: '/',
      name: 'Roulette 8 - Indian',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JILI.webp`,
      type: 'square',
      link: '/',
      name: 'JILI',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JILI-TABLE-014.webp`,
      type: 'square',
      link: '/',
      name: 'Baccarat',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JILI-TABLE-014.webp`,
      type: 'square',
      link: '/',
      name: 'Baccarat',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JILI-TABLE-012.webp`,
      type: 'square',
      link: '/',
      name: 'Dragon Tiger',
      enableFooter: true,
    },
    {
      image: `${baseUrl}PP-LIVE-001.webp`,
      type: 'square',
      link: '/',
      name: 'Bacarrat 1',
      enableFooter: true,
    },
    {
      image: `${baseUrl}NETENT-SLOT-080.webp`,
      type: 'square',
      link: '/',
      name: 'Lost Relics',
      enableFooter: true,
    },
    {
      image: `${baseUrl}NLC-SLOT-023.webp`,
      type: 'square',
      link: '/',
      name: 'The Rave',
      enableFooter: true,
    },
    {
      image: `${baseUrl}JILI-TABLE-042.webp`,
      type: 'square',
      link: '/',
      name: 'Mini Flush',
      enableFooter: true,
    },
  ];
  return {
    displayHomeBanner,
    displayWelcomeBanner,
    isAuthenticated,
    isBannersLoading,
    homeImages,
  };
}
