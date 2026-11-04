import { Icons } from '@/utils/icons';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';
import { useFantasyGameLauncher } from '@/hooks/useFantasyGameLauncher';
import { NavLink, useLocation } from 'react-router-dom';

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

export default function TopNavigation() {
  const location = useLocation();
  const { activeGameId, isLaunchingFantasy, launchFantasyGame, closeFantasyGame } =
    useFantasyGameLauncher();

  return (
    <>
      <div className="bg-top-navbar shadow-[0_2px_6px_-2px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.12)]">
        <div className="overflow-x-auto overflow-y-hidden lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max whitespace-nowrap">
            {menuItems.map((item, index) => {
              const isFantasyItem = item.label === 'Fantasy 11';
              const classes = `hover:underline relative flex items-center gap-1 px-[9.5px] py-1 text-[12px] font-bold lg:h-[27px] lg:px-[10px] capitalize border-r border-black/10 transition-all ${item.special ? 'bg-log-button text-white' : item.danger ? 'bg-[#d71919] text-black' : 'text-[var(--primary-textcolork)] hover:bg-black/5'} ${item.highlight ? 'highlight-menus' : ''}`;

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
                        `${classes}${isActive && !item.special && !item.danger ? 'text-[var(--theme-color)]' : ''}`
                      }
                    >
                      {item.label}

                      {item.new && (
                        <em className="absolute right-0 top-0 rounded-[2px] px-1 py-[1px] text-[7px] font-black uppercase text-white animate-tagmenu leading-none">
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
      </div>

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
