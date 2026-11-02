import { groupEvents } from './matchTransform';
import type { EventItem } from '@/types/event';

const makeEvent = (id: number, sport: string): EventItem =>
  ({
    id,
    competitionId: id,
    providerId: null,
    externalId: String(id),
    name: `${sport} Event`,
    sport,
    startTime: '2026-08-25T00:00:00.000Z',
    status: 'ACTIVE',
    isFancy: false,
    isBookmaker: false,
    isPopular: false,
    isPremiumFancy: false,
    isMatchOdds: true,
    inplay: false,
    createdAt: '2026-08-25T00:00:00.000Z',
    updatedAt: '2026-08-25T00:00:00.000Z',
    competition: { id, name: `${sport} Competition` },
    runners: [],
  }) as EventItem;

describe('groupEvents', () => {
  it('groups cricket, soccer, football, and tennis events', () => {
    const grouped = groupEvents([
      makeEvent(1, 'Cricket'),
      makeEvent(2, 'Soccer'),
      makeEvent(3, 'Football'),
      makeEvent(4, 'Tennis'),
    ]);

    expect(grouped.cricket).toHaveLength(1);
    expect(grouped.football).toHaveLength(2);
    expect(grouped.tennis).toHaveLength(1);
  });
});
