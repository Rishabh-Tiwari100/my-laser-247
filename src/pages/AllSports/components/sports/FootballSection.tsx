import React from 'react';
import OuterMarketRow from '../OuterMarketRow';
import { cn } from '@/utils';
import { Match } from '@/types/event';
import InplaySportHeader from './InplaySportHeader';
import SportNoDataFallback from './SportNoDataFallback';
import { filterSportMatches, SportMatchFilter } from '../../helpers/sportMatchFilter';
import type { ViewByOption } from '../ViewbyDropdown';
import CompetitionEventGroups from './CompetitionEventGroups';

interface FootballSectionProps {
  matches: Match[];
  showInplayHeader?: boolean;
  viewBy?: ViewByOption;
}

const FootballSection: React.FC<FootballSectionProps> = ({
  matches,
  showInplayHeader = false,
  viewBy = 'Time',
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [matchFilter, setMatchFilter] = React.useState<SportMatchFilter>('all');
  const visibleMatches = React.useMemo(
    () => filterSportMatches(matches, matchFilter),
    [matches, matchFilter]
  );

  if (!showInplayHeader && !matches?.length) return null;
  return (
    <div>
      {showInplayHeader && (
        <InplaySportHeader
          title="Football"
          activeFilter={matchFilter}
          onFilterChange={setMatchFilter}
        />
      )}
      <div className="max-md:hidden">
        <div className="grid grid-cols-12 h-6 bg-[#ededed]">
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
              <CompetitionEventGroups matches={visibleMatches} sportName="football" />
            ) : (
              visibleMatches.map((match, index) => (
                <OuterMarketRow key={index} match={match} sportName="football" />
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

export default FootballSection;
