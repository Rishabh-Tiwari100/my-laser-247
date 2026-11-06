import { Icons } from '@/utils/icons';
import { useHomePage } from './hooks/useHomePage';
import Marquee from '@/components/common/Marquee';
import { FiMic } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';
import { useFantasyGameLauncher } from '@/hooks/useFantasyGameLauncher';
import { Link, useLocation } from 'react-router-dom';
import NewLaunch from './components/NewLaunch';
import MyFavourites from './components/MyFavourites';
import CasinoTabs, { CasinoTab } from './components/CasinoTabs';
import CasinoGames from './components/CasinoGames';
import TermsPolicy from '../TermsPolicy/index';
import { casinoTabs, homeNavigations } from '@/utils/constants/home';
import { useGetFixtureCountsQuery } from '@/store/api/eventsApi';
import { useEffect, useState } from 'react';
import Providers from './components/Providers';
import HomeFooter from './components/HomeFooter';

const WELCOME_BANNER_PENDING_KEY = 'welcomeBannerPending';

const getBannerLink = (link?: string) => {
  if (!link) return '';

  const markdownLinkMatch = link.match(/\]\((.*?)\)/);
  return markdownLinkMatch?.[1] || link;
};

const getDownloadName = (name?: string) => name?.trim().replace(/\s+/g, '-') || 'welcome-banner';

function Home() {
  const { displayWelcomeBanner, isAuthenticated, isBannersLoading, homeImages } = useHomePage();
  const location = useLocation();
  const { activeGameId, isLaunchingFantasy, launchFantasyGame, closeFantasyGame } =
    useFantasyGameLauncher();
  const { data: fixtureCountsData } = useGetFixtureCountsQuery();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const welcomeBanner = displayWelcomeBanner[0];
  const welcomeBannerLink = getBannerLink(welcomeBanner?.link);

  const inplayCounts = fixtureCountsData?.counts.inplay;

  const sports = [
    { name: 'Cricket', count: inplayCounts?.sports.Cricket ?? 0, path: '/inplay' },
    { name: 'Football', count: inplayCounts?.sports.Football ?? 0, path: '/inplay' },
    { name: 'Tennis', count: inplayCounts?.sports.Tennis ?? 0, path: '/inplay' },
    { name: 'Casino', count: 0, path: '/inplay' },
    { name: 'Sports book', count: 0, path: '/inplay' },
    { name: 'Horse Racing', count: 0, path: '/inplay' },
    { name: 'Greyhound Racing', count: 0, path: '/inplay' },
    { name: 'Other', count: 0, path: '/inplay' },
    { name: 'Binary', count: 0, path: '/inplay' },
    { name: 'Kabaddi', count: 0, path: '/inplay' },
    { name: 'Politics', count: 0, path: '/inplay' },
    { name: 'Basketball', count: 0, path: '/inplay' },
    { name: 'Baseball', count: 0, path: '/inplay' },
    { name: 'Table Tennis', count: 0, path: '/inplay' },
    { name: 'Volleyball', count: 0, path: '/inplay' },
    { name: 'Ice Hockey', count: 0, path: '/inplay' },
    { name: 'Rugby', count: 0, path: '/inplay' },
    { name: 'Mixed Martial Arts', count: 0, path: '/inplay' },
    { name: 'Darts', count: 0, path: '/inplay' },
    { name: 'Futsal', count: 0, path: '/inplay' },
    { name: 'Genius', count: 0, path: '/inplay' },
    { name: 'Predix', count: 0, path: '/inplay' },
  ];

  const popularCasinoGames = [
    {
      name: 'Creedroomz',
      img: '/images/home-images/creed-roomz.gif',
      link: '/casino?search=creedroomz',
    },
    {
      name: 'Lightning',
      img: '/images/home-images/lightning.gif',
      link: '/casino?search=lightning',
    },
    {
      name: 'Instalive',
      img: '/images/home-images/insta-live.gif',
      link: '/casino?search=instalive',
    },
    { name: 'Sexy', img: '/images/home-images/sexy.gif', link: '/casino?search=sexy' },
    {
      name: 'Aviator',
      img: '/images/home-images/aviator.webp',
      link: '/casino?search=aviator',
    },
    {
      name: 'Mines',
      img: '/images/home-images/mines.webp',
      link: '/casino?search=mine',
    },
    {
      name: 'Bikini Games',
      img: '/images/home-images/bikini-games.gif',
      link: '/casino?search=bikini',
    },
    {
      name: 'Chicken & Color',
      img: '/images/home-images/chicken-color.gif',
      link: '/casino?search=chicken',
    },
  ];

  const [activeTab, setActiveTab] = useState<CasinoTab | undefined>(casinoTabs[0]);

  const handleTabChange = (tab: CasinoTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!isAuthenticated || isBannersLoading || displayWelcomeBanner.length === 0) return;

    const shouldShowWelcomeBanner =
      window.sessionStorage.getItem(WELCOME_BANNER_PENDING_KEY) === 'true';

    if (shouldShowWelcomeBanner) {
      setShowWelcomeBanner(true);
    }
  }, [displayWelcomeBanner.length, isAuthenticated, isBannersLoading]);

  const handleCloseWelcomeBanner = () => {
    window.sessionStorage.removeItem(WELCOME_BANNER_PENDING_KEY);
    setShowWelcomeBanner(false);
  };

  const welcomeBannerOverlay =
    showWelcomeBanner && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/70 px-4"
            role="presentation"
            onClick={handleCloseWelcomeBanner}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Welcome"
              className="relative max-h-[80vh] w-full max-w-[calc(100vw-2rem)] lg:max-w-[1120px]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleCloseWelcomeBanner}
                aria-label="Close welcome banner"
                className="absolute -right-[10px] -top-[10px] z-10 rounded-full bg-[#1f2937] p-2 shadow-lg transition hover:bg-[#111827]"
              >
                <Icons.close className="size-4 text-white" />
              </button>

              {welcomeBannerLink ? (
                <a
                  href={welcomeBannerLink}
                  target="_blank"
                  rel="noreferrer"
                  download={getDownloadName(welcomeBanner?.name)}
                  className="block"
                >
                  <img
                    className="block max-h-[80vh] w-full object-contain"
                    src={welcomeBanner?.image}
                    alt="Welcome"
                  />
                </a>
              ) : (
                <img
                  className="block max-h-[80vh] w-full object-contain"
                  src={welcomeBanner?.image}
                  alt="Welcome"
                />
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative mx-auto w-full px-px font-helvetica min-[576px]:max-w-[540px] md:max-w-[720px] min-[992px]:max-w-[960px] lg:px-[2px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1344px]">
      {/* Full Width Marquee */}

      <div className="pt-[0.125rem]">
        <Marquee icon={FiMic} tagName="News" />
      </div>

      <div aria-label="Homepage sports" className="flex h-[35px] w-full overflow-x-auto overflow-y-hidden whitespace-nowrap bg-black text-center font-helvetica text-[13px] lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {homeNavigations.map((nav, index) =>
          nav.label === 'Fantasy 11' ? (
            <button
              key={index}
              type="button"
              disabled={isLaunchingFantasy || activeGameId !== null}
              className="animate-menuHighlight shrink-0 px-[10px] py-[8px] text-[13px] text-white border-r border-[#333] hover:bg-[#1a1a1a] disabled:cursor-wait disabled:opacity-70"
              aria-disabled={isLaunchingFantasy || activeGameId !== null}
              aria-busy={isLaunchingFantasy}
              onClick={() => void launchFantasyGame()}
            >
              {nav.label}
            </button>
          ) : (
            <Link
              key={index}
              to={nav.href}
              className={`shrink-0 px-[10px] py-[8px] text-[13px] text-white border-r border-[#333] hover:bg-[#1a1a1a] `}
            >
              {nav.label}
            </Link>
          )
        )}
      </div>

      <CasinoGameLauncher
        open={activeGameId !== null}
        gameId={activeGameId}
        title="Fantasy 11"
        closePath={location.pathname}
        onClose={closeFantasyGame}
      />

      <Link to="/popular-events" className="mb-[6px] block w-full">
        <img
          className="block h-auto max-w-full w-full"
          src="/images/home-images/main-banner.gif"
          alt=""
        />
      </Link>

      {welcomeBannerOverlay}

      <div>
        <div aria-label="Sports highlights" className="grid grid-cols-1 gap-[2px] md:grid-cols-2 lg:gap-[4px]">
          <div className="relative min-w-0 overflow-hidden bg-black">
            <Link to="/inplay" className="block" aria-label="Sports">
              <img
                className="block aspect-[73/28] w-full object-cover"
                src="/images/home-images/sports.png"
                alt=""
              />
              <p className="flex h-[30px] w-full items-center justify-center bg-black px-[2px] text-[12px] font-normal capitalize leading-[13.2px] text-white lg:text-[15px]">
                Sports
              </p>
            </Link>
              <div aria-label="Live sports" className="absolute right-0 top-0 h-full w-[105px] overflow-x-hidden overflow-y-auto bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0.7)_82%,transparent_100%)] px-[2px] py-[8px] text-left lg:w-[150px] lg:px-[5px] lg:py-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <p className="mt-[2px] mb-px inline-flex h-[18px] w-[69px] items-center rounded-[3px] bg-gradient-to-b from-[#fb3434] to-[#e80505] pr-[10px] text-[12px] font-bold leading-[18px] text-white lg:mt-px lg:h-[20px] lg:w-[59px] lg:pr-[5px] lg:leading-5">
                  <span className="mr-[5px] flex h-full items-center justify-center rounded-l-[3px] bg-gradient-to-b from-white to-[#e8e8e8] px-[3px]">
                    <span className="live-icon animate-twinkling" />
                  </span>
                  LIVE
                </p>
                <div className="pb-2">
                  {sports.map((sport) => (
                    <Link
                      key={sport.name}
                      to={sport.path}
                      className="flex items-center justify-between gap-1 text-[10px] lg:text-xs"
                    >
                      <h3 className="whitespace-nowrap text-white font-normal capitalize leading-[20px] ">
                        {sport.name}
                      </h3>
                      <span className="h-[14px] min-w-[14px] shrink-0 rounded-[3px] bg-white px-[2px] text-center leading-[14px] text-[#333] lg:h-4 lg:leading-4">
                        {sport.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
          </div>
          <div className="relative min-w-0 overflow-hidden bg-black">
            <Link to="#" className="block" aria-label="Sports Book">
              <img
                className="block aspect-[73/28] w-full object-cover"
                src="/images/home-images/sportsbook.webp"
                alt=""
              />
            </Link>
            <p className="flex h-[30px] w-full items-center justify-center bg-black px-[2px] text-[12px] font-normal capitalize leading-[13.2px] text-white lg:text-[15px]">
              Sports Book
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[2px] grid grid-cols-4 gap-[2px] lg:mt-[4px] lg:gap-[4px]">
        {popularCasinoGames.map((item) => (
          <div className="relative">
            <Link to={item?.link} className="block">
              <img src={item.img} className="block aspect-[1.3] w-full object-cover" />
              <p className="flex w-full h-[30px] bg-black justify-center capitalize text-white text-[11px] sm:text-[13px] lg:text-[15px] items-center font-medium pl-[2px] sm:pl-[6px] lg:pl-[10px]">
                {item.name}
              </p>
            </Link>
          </div>
        ))}
      </div>

      <NewLaunch />
      <MyFavourites />

      {/* <CasinoTabs activeTab={activeTab} onTabChange={handleTabChange} /> */}

      {/* <CasinoGames tab={activeTab} /> */}
      <Providers />
      <HomeFooter />

    </div>
  );
}

export default Home;
