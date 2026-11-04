import HomeGameSection from './HomeGameSection';

const games = [
  { name: 'Andar Bahar', img: '/images/home-images/my-favourites/andar-bahar.png' },
  {
    name: 'Cricket Ball Roulette',
    img: '/images/home-images/my-favourites/cricket-ball-roulette.jpg',
  },
  {
    name: 'Lightning Amar Akbar Anthony',
    img: '/images/home-images/my-favourites/lightning-amar-akbar-anthony.png',
  },
  {
    name: 'Lightning Dragon Tiger',
    img: '/images/home-images/my-favourites/lightning-dragon-tiger.png',
  },
  {
    name: 'Lightning Instant Super Over',
    img: '/images/home-images/my-favourites/lightning-instant-super-over.png',
  },
  { name: 'Money Heist', img: '/images/home-images/my-favourites/money-heist.webp' },
  { name: 'Teen Patti 1 Day', img: '/images/home-images/my-favourites/teen-patti-1-day.webp' },
  {
    name: 'Ultimate Andar Bahar',
    img: '/images/home-images/my-favourites/ultimate-andar-bahar.png',
  },
];

export default function MyFavourites() {
  return <HomeGameSection title="My Favourites" games={games} />;
}
