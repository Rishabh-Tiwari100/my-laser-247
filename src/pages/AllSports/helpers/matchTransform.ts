import { EventItem, GroupedMatches, Match, MatchTag, Runner } from '@/types/event';

const SPORT_MAP: Record<string, keyof GroupedMatches> = {
  cricket: 'cricket',
  football: 'football',
  soccer: 'football',
  tennis: 'tennis',
};

function buildTags(event: EventItem, sport: string): MatchTag[] {
  const tags: MatchTag[] = [];
  if (event.isFancy) tags.push('fancy');
  if (event.isBookmaker) tags.push('bookmaker');
  if (event.isPremiumFancy) tags.push('premium');
  // if (event.isMatchOdds) tags.push('matchOdds');
  //   if (event.inplay) tags.push('streaming');

  const isSrl = event.name?.toLowerCase().includes('srl');
  const sportName = sport?.toLowerCase() ?? '';
  if (isSrl) {
    if (sportName === 'cricket') tags.push('eCricket');
    if (sportName === 'football' || sportName === 'soccer') tags.push('eFootball');
    if (sportName === 'tennis') tags.push('eTennis');
  }

  return tags;
}

function buildRunnerOdds(runner?: Runner) {
  return [
    { price: runner?.backPrice1, type: 'back' as const },
    { price: runner?.layPrice1, type: 'lay' as const },
  ];
}

// Canonical display order: runner[0], runner[2], runner[1]
// This is the draw/tie runner in the middle for cricket/football
function buildDisplayOdds(runners: Runner[]) {
  return [
    ...buildRunnerOdds(runners[0]),
    ...buildRunnerOdds(runners[2]),
    ...buildRunnerOdds(runners[1]),
  ];
}

export function transformEvent(event: EventItem): Match {
  const runners = event.runners ?? [];
  return {
    eventId: Number(event.id),
    eventName: event.name,
    competitionName: event.competition.name,
    competitionId: event.competition.id,
    externalId: event.externalId,
    inplay: event.inplay,
    time: event.startTime,
    sport: event.sport || '',
    tags: buildTags(event, event?.sport),
    status: event.status,
    runners: runners.map((runner) => ({
      runnerName: runner.runnerName || '',
      status: runner?.status,
      odds: buildRunnerOdds(runner),
    })),
    odds: buildDisplayOdds(runners), // ← reordering lives here, not in the component
    isFavourite: Boolean(event.isFavourite ?? false),
  };
}

export function groupEvents(fixtures: EventItem[]): GroupedMatches {
  const grouped: GroupedMatches = { cricket: [], football: [], tennis: [] };

  fixtures.forEach((event) => {
    const group = SPORT_MAP[event.sport?.toLowerCase()];
    if (group) grouped[group].push(transformEvent(event));
  });

  return grouped;
}
