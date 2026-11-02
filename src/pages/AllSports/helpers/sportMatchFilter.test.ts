import { filterSportMatches } from './sportMatchFilter';

const matches = [
  { id: 1, inplay: true },
  { id: 2, inplay: false },
  { id: 3, inplay: true },
];

describe('filterSportMatches', () => {
  it('returns only live matches for the live filter', () => {
    expect(filterSportMatches(matches, 'live')).toEqual([
      { id: 1, inplay: true },
      { id: 3, inplay: true },
    ]);
  });

  it('always returns no matches for the virtual filter', () => {
    expect(filterSportMatches(matches, 'virtual')).toEqual([]);
  });

  it('returns all matches when no filter is selected', () => {
    expect(filterSportMatches(matches, 'all')).toBe(matches);
  });
});
