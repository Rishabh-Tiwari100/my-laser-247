import { groupEvents } from './matchTransform';
import type { EventItem } from '@/types/event';

const fixture = (id: number, sport: string, isFavourite = false): EventItem => ({
  id,
  name: `Event ${id}`,
  sport,
  isFavourite,
  competitionId: 1,
  competition: { id: 1, name: 'Competition' },
  providerId: null,
  externalId: String(id),
  startTime: '2026-11-11T12:00:00Z',
  status: 'ACTIVE',
  inplay: true,
  isFancy: false,
  isBookmaker: false,
  isPopular: false,
  isPremiumFancy: false,
  isMatchOdds: true,
  createdAt: '',
  updatedAt: '',
  runners: [],
});

describe('pinned event ordering', () => {
  it('puts favourites first within each sport and preserves the existing order otherwise', () => {
    const fixtures = [
      fixture(1, 'Cricket'), fixture(2, 'Cricket', true),
      fixture(3, 'Cricket'), fixture(4, 'Cricket', true),
      fixture(5, 'Soccer'), fixture(6, 'Soccer', true),
      fixture(7, 'Tennis'), fixture(8, 'Tennis', true),
    ];
    const grouped = groupEvents(fixtures);
    expect(grouped.cricket.map((match) => match.eventId)).toEqual([2, 4, 1, 3]);
    expect(grouped.football.map((match) => match.eventId)).toEqual([6, 5]);
    expect(grouped.tennis.map((match) => match.eventId)).toEqual([8, 7]);
    expect(fixtures.map((event) => event.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('preserves the source order when no event is pinned', () => {
    expect(groupEvents([fixture(3, 'Cricket'), fixture(1, 'Cricket')]).cricket
      .map((match) => match.eventId)).toEqual([3, 1]);
    expect(groupEvents([])).toEqual({ cricket: [], football: [], tennis: [] });
  });
});
