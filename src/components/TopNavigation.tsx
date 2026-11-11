import { Icons } from '@/utils/icons';
import { useIsAuthenticated } from '@/hooks';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';
import { useFantasyGameLauncher } from '@/hooks/useFantasyGameLauncher';
import { NavLink, useLocation } from 'react-router-dom';
import { mdiCog } from '@mdi/js';

const menuItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'In-Play', href: '/inplay' },
  {
    label: 'Multi Market',
    href: '/multi-market',
    danger: true,
  },
  { label: 'Cricket', href: '/sports/cricket' },
  { label: 'Football', href: '/sports/football' },
  { label: 'Tennis', href: '/sports/tennis' },
  { label: 'Fantasy 11', href: '#', highlight: true },
  { label: 'Cock Fight', href: '#' },
  {
    label: 'Casino',
    href: '/casino',
    highlight: true,
  },
  {
    label: 'Sports Book',
    href: '#',
    special: true,
    new: true,
  },
  { label: 'Horse Racing', href: '#' },
  { label: 'Greyhound Racing', href: '#' },
  { label: 'Other', href: '#' },
  { label: 'Binary', href: '#', new: true },
  { label: 'Kabaddi', href: '#' },
  { label: 'Politics', href: '#' },
  { label: 'Basketball', href: '#' },
  { label: 'Baseball', href: '#' },
  { label: 'Table Tennis', href: '#' },
  { label: 'Volleyball', href: '#' },
  { label: 'Ice Hockey', href: '#' },
  { label: 'Rugby', href: '#' },
  {
    label: 'Mixed Martial Arts',
    href: '#',
  },
  { label: 'Darts', href: '#' },
  { label: 'Futsal', href: '#' },
  { label: 'Genius', href: '#' },
  { label: 'Predix', href: '#', highlight: true },
];

export default function TopNavigation({
  stakeSettingsOpen = false,
  onToggleStakeSettings,
}: { stakeSettingsOpen?: boolean; onToggleStakeSettings?: () => void } = {}) {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const visibleItems = isAuthenticated
    ? menuItems
    : menuItems.filter(
        (item) =>
          ![
            'Multi Market',
            'Fantasy 11',
            'Cock Fight',
            'Other',
            'Predix',
            'Futsal',
            'Genius',
          ].includes(item.label)
      );
  const { activeGameId, isLaunchingFantasy, launchFantasyGame, closeFantasyGame } =
    useFantasyGameLauncher();

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="relative flex h-[28px] bg-top-navbar font-helvetica shadow-[0_2px_6px_-2px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.12)]"
      >
        <div className="h-[28px] min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:auto] [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-[#ccc] [&::-webkit-scrollbar-track]:bg-white">
          <ul className="flex h-[26px] w-max whitespace-nowrap pl-[8px] pr-[100px]">
            {visibleItems.map((item, index) => {
              const isFantasyItem = item.label === 'Fantasy 11';
              const classes = `relative flex h-[26px] items-center gap-1 border-r border-[rgba(69,32,7,0.2)] px-[10px] py-[4px] text-[12px] font-bold capitalize leading-[18px] hover:underline ${item.special ? 'bg-log-button text-white' : item.danger ? 'bg-log-button text-black' : 'text-black'} ${item.highlight ? 'animate-[zoom-in-out_1s_ease-out_infinite]' : ''}`;

              return (
                <li key={`${item.label}-${item.href}-${index}`}>
                  {isFantasyItem ? (
                    <button
                      type="button"
                      disabled={isLaunchingFantasy || activeGameId !== null}
                      className={`${classes} disabled:cursor-wait disabled:opacity-70`}
                      aria-disabled={isLaunchingFantasy || activeGameId !== null}
                      aria-busy={isLaunchingFantasy}
                      onClick={() => void launchFantasyGame()}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `${classes}${isActive && item.href !== '#' && !item.special && !item.danger ? ' bg-[linear-gradient(180deg,#123696_0%,#13a0dd_61%)]' : ''}`
                      }
                    >
                      {item.label}

                      {item.new && (
                        <em className="absolute right-0 top-0 rounded-[1px] px-1 py-[1px] text-[7px] font-black uppercase not-italic text-white animate-tagmenu [line-height:normal]">
                          New
                        </em>
                      )}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {isAuthenticated && onToggleStakeSettings && (
          <button
            type="button"
            aria-label="Toggle stake settings"
            aria-expanded={stakeSettingsOpen}
            aria-controls="sidebar-stake-settings"
            onClick={onToggleStakeSettings}
            className="absolute right-0 top-0 flex h-[26px] w-[80px] items-center justify-center gap-[3px] bg-[linear-gradient(#f72424,#bb1c00)] px-[10px] text-[12px] font-bold text-white"
          >
            Setting
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px] fill-current">
              <path d={mdiCog} />
            </svg>
          </button>
        )}
      </nav>

      <CasinoGameLauncher
        open={activeGameId !== null}
        gameId={activeGameId}
        title="Fantasy 11"
        closePath={location.pathname}
        onClose={closeFantasyGame}
      />
    </>
  );
}
