import React from 'react';
import { useLocation } from 'react-router-dom';
import OuterMarketRow from '../OuterMarketRow';
import { cn } from '@/utils';
import { Match } from '@/types/event';
import InplaySportHeader from './InplaySportHeader';
import SportNoDataFallback from './SportNoDataFallback';
import { filterSportMatches, SportMatchFilter } from '../../helpers/sportMatchFilter';
import type { ViewByOption } from '../ViewbyDropdown';
import CompetitionEventGroups from './CompetitionEventGroups';

interface TennisSectionProps {
  matches: Match[];
  showInplayHeader?: boolean;
  viewBy?: ViewByOption;
}

const TennisSection: React.FC<TennisSectionProps> = ({
  matches,
  showInplayHeader = false,
  viewBy = 'Time',
}) => {
  const isDashboard = useLocation().pathname === '/dashboard';
  const [isOpen, setIsOpen] = React.useState(true);
  const [matchFilter, setMatchFilter] = React.useState<SportMatchFilter>('all');
  const visibleMatches = React.useMemo(
    () => filterSportMatches(matches, matchFilter),
    [matches, matchFilter]
  );

  if (!showInplayHeader && !matches?.length) return null;
  return (
    <div className="">
      {showInplayHeader && (
        <InplaySportHeader
          title="Tennis"
          activeFilter={matchFilter}
          onFilterChange={setMatchFilter}
        />
      )}
      <div className={cn("max-md:hidden", isDashboard && "max-lg:hidden")}>
        <div className={cn("grid grid-cols-12 h-6 bg-[#ededed]", isDashboard && "lg:h-[21px] lg:bg-[#cfd6da]")}>
          <div className="col-span-7"></div>
          <div className="col-span-4 flex gap-2 justify-center items-center text-xs font-medium text-[#000]">
            <div className="text-center w-[141px]">1</div>
            <div className="text-center w-[141px]">X</div>
            <div className="text-center w-[141px]">2</div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-primary-light/10 md:bg-none">
          {visibleMatches.length ? (
            viewBy === 'Competition' ? (
              <CompetitionEventGroups matches={visibleMatches} sportName="tennis" />
            ) : (
              visibleMatches.map((match, index) => (
                <OuterMarketRow key={index} match={match} sportName="tennis" />
              ))
            )
          ) : (
            <SportNoDataFallback />
          )}
        </div>
      </div>
    </div>
  );
};

export default TennisSection;
