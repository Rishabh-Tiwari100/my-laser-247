import LiveIcon from '@/components/common/LiveIcon';
import { useGetFixtureCountsQuery } from '@/store/api/eventsApi';
import { cn } from '@/utils';
import React from 'react';

interface Props {
  image: string;
  type: string;
  link: string;
  name: string;
  enableFooter: boolean;
}

const HomeImageContainer = ({ image, type, link, name, enableFooter }: Props) => {
  const { data: fixtureCountsData } = useGetFixtureCountsQuery();

  const getLiveSportCount = (sportName: string) => {
    const aliases = sportName === 'Soccer' ? ['Soccer', 'Football'] : [sportName];

    return ['inplay', 'today', 'upcoming'].reduce((total, countType) => {
      const sportCounts =
        fixtureCountsData?.counts[countType as keyof typeof fixtureCountsData.counts].sports ?? {};
      const matchedSport = Object.keys(sportCounts).find((key) =>
        aliases.some((alias) => key.toLowerCase() === alias.toLowerCase())
      );

      return total + (matchedSport ? (sportCounts[matchedSport] ?? 0) : 0);
    }, 0);
  };

  const liveSports = [
    { name: 'Cricket', count: getLiveSportCount('Cricket') },
    { name: 'Soccer', count: getLiveSportCount('Soccer') },
    { name: 'Tennis', count: getLiveSportCount('Tennis') },
  ];
  return (
    <div
      className={cn(
        'w-full h-full object-cover relative cursor-pointer',
        type === 'square' && 'col-span-1',
        type === 'halfWidth' && 'col-span-2'
      )}
    >
      {name === 'Sports' && (
        <div className="absolute top-0 right-0 w-[125px] bg-gradient-to-b from-black/95 from-0% via-black/70 via-90% to-black/0 to-100% text-white ">
          {/* Header */}
          <div className="px-2 pt-1 pb-6">
            <LiveIcon label="LIVE" size="md" />
          </div>

          {/* Sports List */}
          <div className="px-2 py-1">
            {liveSports.map((sport) => (
              <div key={sport.name} className="flex items-center justify-between py-[2px]">
                <span className="text-[12px]">{sport.name}</span>

                <span className="min-w-[20px] rounded bg-white px-1 text-center text-[11px] text-black/90">
                  {sport.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <img src={image} alt={type} className="h-full w-full object-cover" />
      {enableFooter && (
        <div className="absolute bottom-0 right-0 left-0 flex border-b-4 border-primary-yellow">
          <span className="h-[40px] flex-1 flex items-center text-white font-bold capitalize px-3 bg-black/40">
            {name}
          </span>

          <div className="relative inline-flex items-center">
            <div
              className="absolute -top-[1px] left-[1px] -translate-x-full h-[42px] w-[22px] bg-primary-yellow"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
            />

            <span className="h-[40px] flex items-center bg-primary-yellow text-14 px-2 font-bold font-tahoma">
              Play Now
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeImageContainer;
