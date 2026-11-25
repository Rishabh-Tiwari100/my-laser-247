import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import CasinoGameLauncher from '@/components/casino/CasinoGameLauncher';

type HomeGameCard = {
  name: string;
  img: string;
  gameId: number | null;
  browsePath?: string;
};

interface HomeGameSectionProps {
  title: string;
  games: HomeGameCard[];
}

export default function HomeGameSection({ title, games }: HomeGameSectionProps) {
  const [activeGame, setActiveGame] = useState<HomeGameCard | null>(null);
  const { pathname, search, hash } = useLocation();
  const cardClass =
    'relative block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';

  return (
    <section aria-label={title} className="mt-[2px] lg:mt-[4px]">
      <h2 className="mb-[3px] flex w-full items-center bg-log-button px-[5px] py-[8px] text-[16px] font-normal uppercase leading-[17.6px] text-white">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-[2px] md:grid-cols-4 lg:gap-[4px]">
        {games.map((game) => {
          const content = (
            <>
              <img
                src={game.img}
                alt=""
                loading="lazy"
                className="block h-[78px] w-full max-w-full object-cover lg:h-[198px]"
              />
              <span className="flex h-[30px] w-full items-center justify-center bg-black px-[2px] text-center text-[12px] font-normal capitalize leading-tight text-white lg:px-[10px] lg:text-[15px]">
                <span className="line-clamp-2" title={game.name}>
                  {game.name}
                </span>
              </span>
            </>
          );

          if (game.browsePath) {
            return (
              <Link key={game.img} to={game.browsePath} className={cardClass}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={game.img}
              type="button"
              className={cardClass}
              disabled={activeGame !== null}
              onClick={() => {
                if (game.gameId === null) {
                  toast.error(`${game.name} is currently unavailable.`);
                  return;
                }
                setActiveGame(game);
              }}
            >
              {content}
            </button>
          );
        })}
      </div>
      <CasinoGameLauncher
        open={activeGame !== null}
        gameId={activeGame?.gameId ?? null}
        title={activeGame?.name}
        closePath={`${pathname}${search}${hash}`}
        onClose={() => setActiveGame(null)}
      />
    </section>
  );
}
