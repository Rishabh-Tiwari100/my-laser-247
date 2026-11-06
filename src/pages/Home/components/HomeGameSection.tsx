interface HomeGameSectionProps {
  title: string;
  games: { name: string; img: string }[];
}

export default function HomeGameSection({ title, games }: HomeGameSectionProps) {
  return (
    <section aria-label={title} className="mt-[2px] lg:mt-[4px]">
      <h2 className="mb-[3px] flex w-full items-center bg-log-button px-[5px] py-[8px] text-[16px] font-normal uppercase leading-[17.6px] text-white">
        {title}
      </h2>
      <div className="grid grid-cols-3 gap-[2px] md:grid-cols-4 lg:gap-[4px]">
        {games.map((game) => (
          <div key={game.img} className="relative">
            <img
              src={game.img}
              alt={game.name}
              loading="lazy"
              className="block h-[78px] w-full max-w-full object-cover lg:h-[198px]"
            />
            <p className="flex h-[30px] w-full items-center justify-center bg-black px-[2px] text-center text-[12px] font-normal capitalize leading-tight text-white lg:px-[10px] lg:text-[15px]">
              <span className="line-clamp-2" title={game.name}>{game.name}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
