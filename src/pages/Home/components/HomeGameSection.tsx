interface HomeGameSectionProps {
  title: string;
  games: { name: string; img: string }[];
}

export default function HomeGameSection({ title, games }: HomeGameSectionProps) {
  return (
    <section aria-label={title} className="mt-4">
      <h2 className="flex w-full items-center bg-log-button p-[5px] text-[15px] font-normal uppercase leading-[1.5] text-white">
        {title}
      </h2>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {games.map((game) => (
          <div key={game.img} className="relative">
            <img
              src={game.img}
              alt={game.name}
              loading="lazy"
              className="h-[70px] w-full max-w-full md:h-[255px]"
            />
            <p className="flex h-[30px] w-full items-center justify-center bg-black px-[2px] text-center text-[11px] font-medium capitalize leading-tight text-white sm:px-[6px] sm:text-[13px] lg:px-[10px] lg:text-[15px]">
              <span className="line-clamp-2" title={game.name}>{game.name}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
