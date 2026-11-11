import OuterMarketRow from '../OuterMarketRow';
import type { Match } from '@/types/event';

interface CompetitionEventGroupsProps {
  matches: Match[];
  sportName: 'cricket' | 'football' | 'tennis';
}

const groupMatchesByCompetition = (matches: Match[]) =>
  matches.reduce(
    (groups, match) => {
      const key = match.competitionId ?? match.competitionName ?? 'Other';
      const existingGroup = groups.find((group) => group.key === key);

      if (existingGroup) {
        existingGroup.matches.push(match);
        return groups;
      }

      return [
        ...groups,
        {
          key,
          name: match.competitionName || 'Other',
          matches: [match],
        },
      ];
    },
    [] as { key: number | string; name: string; matches: Match[] }[]
  );

export default function CompetitionEventGroups({
  matches,
  sportName,
}: CompetitionEventGroupsProps) {
  const pinnedMatches = matches.filter((match) => match.isFavourite);
  const groups = groupMatchesByCompetition(matches.filter((match) => !match.isFavourite));

  return (
    <>
      {pinnedMatches.map((match) => (
        <OuterMarketRow key={match.eventId} match={match} sportName={sportName} />
      ))}
      {groups.map((group) => (
        <div key={group.key}>
          <div className="bg-[#203946] px-[13px] py-[9px] text-[13px] font-bold leading-none text-white">
            {group.name}
          </div>
          {group.matches.map((match) => (
            <OuterMarketRow key={match.eventId} match={match} sportName={sportName} />
          ))}
        </div>
      ))}
    </>
  );
}
