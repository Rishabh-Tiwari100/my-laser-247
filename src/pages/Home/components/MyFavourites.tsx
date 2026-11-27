import HomeGameSection from './HomeGameSection';

const games = [
  { name: 'Andar Bahar', img: '/images/home-images/my-favourites/andar-bahar.png', gameId: 209 },
  {
    name: 'Cricket Ball Roulette',
    img: '/images/home-images/my-favourites/cricket-ball-roulette.jpg',
    gameId: 7480,
  },
  {
    name: 'Lightning Amar Akbar Anthony',
    img: '/images/home-images/my-favourites/lightning-amar-akbar-anthony.png',
    gameId: 2335,
  },
  {
    name: 'Lightning Dragon Tiger',
    img: '/images/home-images/my-favourites/lightning-dragon-tiger.png',
    gameId: 2341,
  },
  {
    name: 'Lightning Instant Super Over',
    img: '/images/home-images/my-favourites/lightning-instant-super-over.png',
    gameId: 2343,
  },
  { name: 'Money Heist', img: '/images/home-images/my-favourites/money-heist.webp', gameId: 238 },
  {
    name: 'Teen Patti 1 Day',
    img: '/images/home-images/my-favourites/teen-patti-1-day.webp',
    gameId: 3773,
  },
  {
    name: 'Ultimate Andar Bahar',
    img: '/images/home-images/my-favourites/ultimate-andar-bahar.png',
    gameId: 17167,
  },
];

export default function MyFavourites() {
  return <HomeGameSection title="My Favourites" games={games} />;
}
