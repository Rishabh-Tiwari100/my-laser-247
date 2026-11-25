import HomeGameSection from './HomeGameSection';

const games = [
  {
    name: 'JILI',
    img: '/images/home-images/new-launch/jili.png',
    gameId: null,
    browsePath: '/casino?provider=JILI',
  },
  { name: 'Dhamaka', img: '/images/home-images/new-launch/dhamaka.png', gameId: null },
  {
    name: 'Golden Garuda 1000',
    img: '/images/home-images/new-launch/golden-garuda-1000.png',
    gameId: null,
  },
  {
    name: 'Rooster Knockout',
    img: '/images/home-images/new-launch/rooster-knockout.png',
    gameId: null,
  },
  { name: 'Money Heist', img: '/images/home-images/new-launch/money-heist.png', gameId: null },
  { name: 'Roadster', img: '/images/home-images/new-launch/roadster.png', gameId: null },
  { name: 'Twistx', img: '/images/home-images/new-launch/twist-x.png', gameId: null },
  { name: 'Instant Rummy', img: '/images/home-images/new-launch/instant-rummy.png', gameId: null },
  { name: 'Jhandi Munda', img: '/images/home-images/new-launch/jhandi-munda.webp', gameId: 2119 },
  {
    name: 'Blackjack Multiplayer 1',
    img: '/images/home-images/new-launch/blackjack-multiplayer-1.png',
    gameId: null,
  },
  {
    name: 'Deal Or No Deal',
    img: '/images/home-images/new-launch/deal-or-no-deal.png',
    gameId: 1023,
  },
  { name: 'Golden Kick', img: '/images/home-images/new-launch/golden-kick.png', gameId: 1791 },
];

export default function NewLaunch() {
  return <HomeGameSection title="New Launch" games={games} />;
}
