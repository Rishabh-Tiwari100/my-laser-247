import HomeGameSection from './HomeGameSection';

const games = [
  {
    name: 'JILI',
    img: '/images/home-images/new-launch/jili.png',
    gameId: null,
    browsePath: '/casino',
  },
  { name: 'Dhamaka', img: '/images/home-images/new-launch/dhamaka.png', gameId: 1348 },
  {
    name: 'Golden Garuda 1000',
    img: '/images/home-images/new-launch/golden-garuda-1000.png',
    gameId: 1529,
  },
  {
    name: 'Rooster Knockout',
    img: '/images/home-images/new-launch/rooster-knockout.png',
    gameId: 5731,
  },
  { name: 'Money Heist', img: '/images/home-images/new-launch/money-heist.png', gameId: 417 },
  { name: 'Roadster', img: '/images/home-images/new-launch/roadster.png', gameId: 3266 },
  { name: 'Twistx', img: '/images/home-images/new-launch/twist-x.png', gameId: 17153 },
  { name: 'Instant Rummy', img: '/images/home-images/new-launch/instant-rummy.png', gameId: 3338 },
  { name: 'Jhandi Munda', img: '/images/home-images/new-launch/jhandi-munda.webp', gameId: 2118 },
  {
    name: 'Blackjack Multiplayer 1',
    img: '/images/home-images/new-launch/blackjack-multiplayer-1.png',
    gameId: 196,
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
