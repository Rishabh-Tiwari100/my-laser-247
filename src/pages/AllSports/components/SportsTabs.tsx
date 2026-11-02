import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import EventSearchModal from '@/components/common/EventSearchModal';
import { useLocation, useNavigate } from 'react-router-dom';

export const tabs = [
  {
    id: 1,
    name: 'Cricket',
    icon: '/assets/cricket_icon-52q1TH3d.svg',
    active: true,
  },
  {
    id: 2,
    name: 'Football',
    icon: '/assets/soccer_icon-D_oPRpBP.svg',
    active: false,
  },
  {
    id: 3,
    name: 'Tennis',
    icon: '/assets/tennis_icon-BlI3OG4K.svg',
    active: false,
  },
  {
    id: 4,
    name: 'Casino',
    icon: '/assets/99999-DA30b-0M.webp',
    active: false,
    highlight: true,
  },
  {
    id: 5,
    name: 'Evolution',
    icon: '/assets/99998-BsEdo6YM.webp',
    active: false,
    highlight: true,
  },
  {
    id: 6,
    name: 'FIFA CUP WINNER',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 7,
    name: 'WINNER CUP',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 8,
    name: 'ELECTION',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 9,
    name: 'Kabaddi',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 10,
    name: 'Election',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 11,
    name: 'Esports',
    icon: '/assets/esports-Bszds_5p.svg',
    active: false,
  },
  {
    id: 12,
    name: 'Mixed Martial Arts',
    icon: '/assets/mixed-martial-arts-XtJQViDg.svg',
    active: false,
  },
  {
    id: 13,
    name: 'Gaelic Games',
    icon: '/assets/gaelic-football-pcLJ60hK.svg',
    active: false,
  },
  {
    id: 14,
    name: 'Volleyball',
    icon: '/assets/volleyball-DYyb2-Rf.svg',
    active: false,
  },
  {
    id: 15,
    name: 'Handball',
    icon: '/assets/handball-BI391dIw.svg',
    active: false,
  },
  {
    id: 16,
    name: 'Australian Rules',
    icon: '/assets/australian-rules-BHo4KJr8.svg',
    active: false,
  },
  {
    id: 17,
    name: 'Ice Hockey',
    icon: '/assets/ice-hockey-Cy-iOoMe.svg',
    active: false,
  },
  {
    id: 18,
    name: 'Basketball',
    icon: '/assets/basketball-CsTqBBZN.svg',
    active: false,
  },
  {
    id: 19,
    name: 'Baseball',
    icon: '/assets/baseball-bHWekfuR.svg',
    active: false,
  },
  {
    id: 20,
    name: 'American Football',
    icon: '/assets/american-football-BV5e5Q20.svg',
    active: false,
  },
  {
    id: 21,
    name: 'Snooker',
    icon: '/assets/snooker-BHcNQ_Ua.svg',
    active: false,
  },
  {
    id: 22,
    name: 'Table Tennis',
    icon: '/assets/sports-no-Deyh8uqr.svg',
    active: false,
  },
  {
    id: 23,
    name: 'Horse Racing',
    icon: '/assets/horse-racing-BSQNi4Xg.svg',
    active: false,
  },
  {
    id: 24,
    name: 'Greyhound Racing',
    icon: '/assets/greyhound-racing-D7JWBBT5.svg',
    active: false,
  },
];

export default function SportsTabs() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabRoutes: Record<string, string> = {
    Cricket: '/sports/cricket',
    Football: '/sports/football',
    Tennis: '/sports/tennis',
    Casino: '/casino',
    Evolution: '/casino/evolution',
  };
  const getActiveTabId = useCallback(() => {
    if (pathname.startsWith('/sports/football') || pathname.startsWith('/sports/soccer')) return 2;
    if (pathname.startsWith('/sports/tennis')) return 3;
    if (pathname.startsWith('/casino/evolution')) return 5;
    if (pathname.startsWith('/casino')) return 4;
    return 1;
  }, [pathname]);
  const [active, setActive] = useState(getActiveTabId);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setActive(getActiveTabId());
  }, [getActiveTabId]);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [active]);

  return (
    <>
    <nav className="relative w-full border-b border-[#c8ced3] bg-white max-lg:border-0 max-lg:bg-[#243a48]" aria-label="Sports">
      <div className="flex min-h-[38px] overflow-x-auto whitespace-nowrap px-1.5 max-lg:min-h-[42px] max-lg:items-end max-lg:gap-px max-lg:pr-11">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={active === tab.id ? activeTabRef : null}
            onClick={() => {
              setActive(tab.id);
              const route = tabRoutes[tab.name];
              if (route) navigate(route);
            }}
            aria-current={active === tab.id ? 'page' : undefined}
            className={`flex h-[37px] shrink-0 items-center gap-1.5 border-b-[3px] px-[14px] text-[13px] font-bold leading-none transition-colors duration-200 max-lg:mt-[5px] max-lg:h-[37px] max-lg:gap-1 max-lg:border max-lg:border-b-0 max-lg:px-3 max-lg:text-[11px] ${active === tab.id
              ? 'border-white bg-[#212121] text-white max-lg:rounded-t-[9px]'
              : 'border-transparent text-[#3b5160] hover:bg-[#212121] hover:text-white max-lg:text-white/90 max-lg:hover:rounded-t-[9px] hover:max-lg:border hover:max-lg:border-white max-lg:border-b-0'
              }`}
          >
            <img
              src={`https://www.lasercric.com${tab.icon}`}
              alt={tab.name}
              className="hidden size-5 shrink-0 object-contain invert max-lg:block"
            />

            <span>{tab.name}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="Search sports"
        onClick={() => setIsSearchOpen(true)}
        className="absolute bottom-0 right-0 hidden h-[42px] w-11 items-center justify-center border-l border-white/20 bg-[#243a48] text-white max-lg:flex"
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </nav>
    <EventSearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
