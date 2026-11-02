export type SportMatchFilter = 'all' | 'live' | 'virtual';

export function filterSportMatches<T extends { inplay: boolean }>(
  matches: T[],
  filter: SportMatchFilter
): T[] {
  if (filter === 'virtual') return [];
  if (filter === 'live') return matches.filter((match) => match.inplay);
  return matches;
}
