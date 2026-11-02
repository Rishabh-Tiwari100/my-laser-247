import dayjs from 'dayjs';
import type { ProfitLossBet, ProfitLossMarketType } from './types';

const now = dayjs();
const relativeDate = (daysAgo: number, hour: number, minute = 0): string =>
  now
    .subtract(daysAgo, 'day')
    .set('hour', hour)
    .set('minute', minute)
    .set('second', 0)
    .format('YYYY-MM-DDTHH:mm:ss+05:30');

interface DemoBetInput {
  id: string;
  sportId: string;
  sportLabel: string;
  apiSport: string;
  eventId: string;
  eventName: string;
  settledAt: string;
  marketName: string;
  selection: string;
  profitLoss: number;
  balance?: number;
  description?: string;
  remark?: string;
  marketType?: ProfitLossMarketType;
}

const createDemoBet = ({
  description,
  marketType = 'Main Market',
  ...bet
}: DemoBetInput): ProfitLossBet => ({
  ...bet,
  eventDate: bet.settledAt,
  marketType,
  description:
    description ||
    `${bet.sportLabel} > ${bet.eventName} > ${bet.marketName} > Result > ${bet.selection}`,
});

export const demoProfitLossBets: ProfitLossBet[] = [
  createDemoBet({
    id: 'soccer-dalian-1',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'dalian-kewei-beijing-guoan',
    eventName: 'Dalian Kewei V Beijing Guoan',
    settledAt: relativeDate(1, 10, 16),
    marketName: 'Match Odds',
    selection: 'Beijing Guoan',
    profitLoss: -36,
    balance: 984.77,
  }),
  createDemoBet({
    id: 'soccer-dalian-2',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'dalian-kewei-beijing-guoan',
    eventName: 'Dalian Kewei V Beijing Guoan',
    settledAt: relativeDate(1, 9, 56),
    marketName: 'Over/Under 2.5 Goals',
    selection: 'Over 2.5 Goals',
    profitLoss: -224,
    balance: 1053.91,
  }),
  createDemoBet({
    id: 'soccer-dalian-3',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'dalian-kewei-beijing-guoan',
    eventName: 'Dalian Kewei V Beijing Guoan',
    settledAt: relativeDate(1, 9, 36),
    marketName: 'Over/Under 1.5 Goals',
    selection: 'Over 1.5 Goals',
    profitLoss: 89.72,
    balance: 1364.77,
  }),
  createDemoBet({
    id: 'soccer-mjallby',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'mjallby-lincoln-red-imps',
    eventName: 'Mjallby V Lincoln Red Imps',
    settledAt: relativeDate(1, 8, 45),
    marketName: 'Match Odds',
    selection: 'Lincoln Red Imps',
    profitLoss: -2,
    balance: 1275.91,
  }),
  createDemoBet({
    id: 'soccer-san-antonio',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'san-antonio-academia',
    eventName: 'San Antonio Bulo Bulo V Academia De Balompie Boli',
    settledAt: relativeDate(1, 7, 40),
    marketName: 'Over/Under 2.5 Goals',
    selection: 'Over 2.5 Goals',
    profitLoss: -210,
    balance: 461.43,
  }),
  createDemoBet({
    id: 'soccer-norrby',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'norrby-sundsvall',
    eventName: 'Norrby IF V Sundsvall',
    settledAt: relativeDate(1, 6, 43),
    marketName: 'Match Odds',
    selection: 'Norrby IF',
    profitLoss: 42.57,
    balance: 671.43,
  }),
  createDemoBet({
    id: 'soccer-orgryte',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'orgryte-djurgardens',
    eventName: 'Orgryte V Djurgardens',
    settledAt: relativeDate(1, 5, 41),
    marketName: 'Match Odds',
    selection: 'The Draw',
    profitLoss: -100,
    balance: 628.86,
  }),
  createDemoBet({
    id: 'soccer-kalmar-1',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'kalmar-malmo-first',
    eventName: 'Kalmar FF V Malmo FF',
    settledAt: relativeDate(1, 4, 40),
    marketName: 'Match Odds',
    selection: 'The Draw',
    profitLoss: 148.5,
    balance: 728.86,
  }),
  createDemoBet({
    id: 'soccer-slavia',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'slavia-sofia-cska-sofia',
    eventName: 'Slavia Sofia V CSKA Sofia',
    settledAt: relativeDate(2, 22, 12),
    marketName: 'Match Odds',
    selection: 'CSKA Sofia',
    profitLoss: -486,
    balance: 859.83,
  }),
  createDemoBet({
    id: 'soccer-suduva',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'suduva-hegelmann',
    eventName: 'FK Suduva V Hegelmann Litauen',
    settledAt: relativeDate(2, 21, 33),
    marketName: 'Match Odds',
    selection: 'Hegelmann Litauen',
    profitLoss: -45,
    balance: 1459.83,
  }),
  createDemoBet({
    id: 'soccer-kalmar-2',
    sportId: 'soccer',
    sportLabel: 'SOCCER',
    apiSport: 'Soccer',
    eventId: 'kalmar-malmo-second',
    eventName: 'Kalmar FF V Malmo FF',
    settledAt: relativeDate(2, 19, 40),
    marketName: 'Correct Score',
    selection: '1 - 1',
    profitLoss: -1,
    balance: 580.36,
  }),
  createDemoBet({
    id: 'tennis-jodar',
    sportId: 'tennis',
    sportLabel: 'TENNIS',
    apiSport: 'Tennis',
    eventId: 'jodar-svrcina',
    eventName: 'Jodar V Svrcina',
    settledAt: relativeDate(1, 9, 12),
    marketName: 'Match Odds',
    selection: 'Jodar',
    profitLoss: -99.36,
    balance: 1277.91,
  }),
  createDemoBet({
    id: 'tennis-ferro',
    sportId: 'tennis',
    sportLabel: 'TENNIS',
    apiSport: 'Tennis',
    eventId: 'ferro-yuf-ren',
    eventName: 'Ferro V Yuf Ren',
    settledAt: relativeDate(2, 21, 46),
    marketName: 'Match Odds',
    selection: 'Fiona Ferro',
    profitLoss: -4000,
    balance: 1459.83,
  }),
  createDemoBet({
    id: 'cricket-hong-kong',
    sportId: 'cricket',
    sportLabel: 'CRICKET',
    apiSport: 'Cricket',
    eventId: 'hong-kong-uganda',
    eventName: 'Hong Kong W V Uganda W',
    settledAt: relativeDate(1, 10, 32),
    marketName: 'Match Odds',
    selection: 'Uganda W',
    profitLoss: 3632.93,
    balance: 982.77,
  }),
  createDemoBet({
    id: 'fifa-cup-winner',
    sportId: 'fifa-cup-winner',
    sportLabel: 'FIFA CUP WINNER',
    apiSport: 'FIFA CUP WINNER',
    eventId: 'fifa-cup-winner-2026',
    eventName: 'FIFA Cup Winner 2026',
    settledAt: relativeDate(1, 8, 0),
    marketName: 'Tournament Winner',
    selection: 'Winner',
    profitLoss: -3934.26,
    balance: 920.17,
  }),
  createDemoBet({
    id: 'worli-kalyan',
    sportId: 'worli-matka',
    sportLabel: 'WORLI MATKA',
    apiSport: 'Worli Matka',
    eventId: 'worli-kalyan',
    eventName: 'KALYAN',
    settledAt: relativeDate(1, 13, 5),
    marketName: 'Close',
    selection: '290',
    profitLoss: -569,
    balance: 651.77,
  }),
  createDemoBet({
    id: 'casino-demo',
    sportId: 'casino',
    sportLabel: 'CASINO',
    apiSport: 'Casino',
    eventId: 'casino-round',
    eventName: 'Casino Games',
    settledAt: relativeDate(1, 12, 10),
    marketName: 'Game Round',
    selection: 'Won',
    profitLoss: 19.6,
    balance: 984.77,
  }),
  createDemoBet({
    id: 'cricket-exchange-demo',
    sportId: 'cricket-exchange',
    sportLabel: 'CRICKET',
    apiSport: 'Cricket',
    eventId: 'mi-london-sunrisers',
    eventName: 'MI London W V Sunrisers Leeds W',
    settledAt: relativeDate(1, 13, 13),
    marketName: 'Toss',
    selection: 'Sunrisers Leeds W',
    profitLoss: -200,
    balance: 647.77,
  }),
];
