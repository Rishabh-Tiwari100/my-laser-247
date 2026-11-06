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

  const secondaryNavigations = [
    {
      path: '/sports/cricket',
      label: 'Evolution',
    },
    {
      path: '/sports/cricket',
      label: 'FIFA CUP WINNER',
    },
    {
      path: '/sports/cricket',
      label: 'WINNER CUP',
    },
    {
      path: '/sports/cricket',
      label: 'ELECTION',
    },
    {
      path: '/sports/cricket',
      label: 'Kabaddi',
    },
    {
      path: '/sports/cricket',
      label: 'Election',
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
    <div className="relative lg:container mx-auto">
      {/* Full Width Marquee */}

      <div className="pt-[0.125rem]">
        <Marquee icon={FiMic} tagName="News" />
      </div>

      <div className="flex lg:hidden bg-black text-center w-full overflow-x-auto justify-between whitespace-nowrap overflow-y-hidden">
        {homeNavigations.map((nav, index) =>
          nav.label === 'Fantasy 11' ? (
            <button
              key={index}
              type="button"
              disabled={isLaunchingFantasy || activeGameId !== null}
              className="animate-menuHighlight  px-2.5 py-[7px] capitalize text-sm text-white border-r border-[#333] hover:bg-[#1a1a1a] disabled:cursor-wait disabled:opacity-70"
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
              className={`px-2.5 py-[7px] capitalize text-sm text-white border-r border-[#333] hover:bg-[#1a1a1a] ${nav.label === 'Casino' ? 'animate-menuHighlight' : ''}`}
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

      <div className="">
        <ul className="flex lg:hidden shadow-[inset_0_-10px_20px_#01929f] bg-[linear-gradient(180deg,_#3729fa,_#2f64f6_80%,_#2f67f6)] overflow-x-auto whitespace-nowrap">
          {secondaryNavigations.map((nav, index) => (
            <li key={index}>
              <Link
                to={nav.path}
                className="block w-full animate-[blinker_1s_linear_infinite] p-[5px] text-center text-[12px] font-semibold uppercase text-white"
              >
                {nav.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/popular-events" className="my-[5px] block w-full">
        <img
          className="h-[66px] lg:h-[250px] max-w-full w-full"
          src="/images/home-images/main-banner.gif"
          alt=""
        />
      </Link>

      {welcomeBannerOverlay}

      <div>
        <div className="grid md:grid-cols-2 gap-2">
          <div className="relative">
            <Link to="/inplay" className="block">
              <img
                className="w-full max-w-full h-auto"
                src="/images/home-images/sports.png"
                alt=""
              />
              <p className="flex w-full h-[30px] capitalize text-[15px] items-center text-white  font-medium pl-[10px] bg-black">
                Sports
              </p>
              <div className="absolute right-0 top-0 p-[10px_5px_40px] text-left w-[180px] lg:w-[190px] overflow-x-hidden overflow-y-auto max-h-[263px] h-full bg-[linear-gradient(180deg,_#000_0%,_rgba(0,0,0,0.7)_82%,_transparent_100%)]">
                <p className="inline-flex h-5 max-w-[58px] items-center rounded-[3px] bg-gradient-to-b from-[#fb3434] to-[#e80505] pr-[5px] text-[12px] font-bold leading-5 text-white mt-[5px] mb-0">
                  <span className="mr-[5px] flex h-full items-center justify-center rounded-l-[3px] bg-gradient-to-b from-white to-[#e8e8e8] px-[3px]">
                    <span className="live-icon animate-twinkling" />
                  </span>
                  LIVE
                </p>
                <div className="pb-5 px-[5px]">
                  {sports.map((sport) => (
                    <div
                      key={sport.name}
                      className="flex cursor-pointer items-center justify-between gap-2 text-[10px] lg:text-xs"
                    >
                      <h3 className="text-white font-normal capitalize leading-[1.8] ">
                        {sport.name}
                      </h3>
                      <span className="text-[#333] bg-white rounded-[3px] px-[3px] min-w-6 h-[14px] lg:h-4 leading-[16px]">
                        {sport.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
          <div className="relative mb-[5px]">
            <Link to="#">
              <img
                className="w-full max-w-full h-auto"
                src="/images/home-images/sportsbook.webp"
                alt=""
              />
            </Link>
            <p className="flex w-full h-[30px] capitalize text-[15px] items-center text-white  font-medium pl-[10px] bg-black">
              Sports Book
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 mt-2">
        {popularCasinoGames.map((item) => (
          <div className="relative">
            <Link to={item?.link} className="block">
              <img src={item.img} className="h-[70px] md:h-[255px] w-full max-w-full" />
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

      <div className="pb-[30px] lg:hidden">
        <div className="flex flex-wrap m-2 gap-2 justify-center">
          <div className="max-w-full flex items-center justify-center gap-[10px]">
            <div className="text-center">
              <Link to="#">
                <img className="w-[150px] max-w-full" src="/images/footer/btn-app.webp" alt="" />
              </Link>
            </div>
            <div className="bg-[linear-gradient(180deg,#414141,#1a1a1a)] rounded-[4px] flex w-[150px] border border-black h-full">
              <Link to="#" className="flex gap-[5px] text-[13px] items-center text-white">
                <div className="bg-black h-full w-[33px] flex items-center justify-center text-white">
                  <img
                    src="/images/footer/blog.svg"
                    className="w-auto max-w-full filter brightness-[100]"
                  />
                </div>
                <div className="text-white">Blogs</div>
              </Link>
            </div>
          </div>
        </div>
        <ul className="flex justify-center gap-[10px] mt-2">
          <li>
            <Link to="#" className="">
              <img src="/images/footer/telegram.png" alt="" className="max-w-10 w-auto" />
            </Link>
          </li>
          <li>
            <Link to="#" className="">
              <img src="/images/footer/instagram.png" alt="" className="max-w-10 w-auto" />
            </Link>
          </li>
        </ul>

        <div className="mt-[10px]">
          <ul className="flex items-center justify-center flex-wrap">
            <li className="inline-block px-[10px]">
              <span className="text-[11px] text-white underline">
                privacy Policy
              </span>
            </li>
            <li className="inline-block px-[10px]">
              <span className="text-[11px] text-white underline">
                terms and conditions
              </span>
            </li>
            <li className="inline-block px-[10px]">
              <span className="text-[11px] text-white underline">
                about us
              </span>
            </li>
            <li className="inline-block px-[10px]">
              <span className="text-[11px] text-white underline">
                responsible gaming
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
