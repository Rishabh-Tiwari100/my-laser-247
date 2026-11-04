import HomeGameSection from './HomeGameSection';

const games = [
  { name: 'JILI', img: '/images/home-images/new-launch/jili.png' },
  { name: 'Dhamaka', img: '/images/home-images/new-launch/dhamaka.png' },
  { name: 'Goal', img: '/images/home-images/new-launch/goal.png' },
  { name: 'Football X', img: '/images/home-images/new-launch/football-x.png' },
  { name: 'Golden Kick', img: '/images/home-images/new-launch/golden-kick.png' },
  { name: 'Twist X', img: '/images/home-images/new-launch/twist-x.png' },
  { name: 'Predix', img: '/images/home-images/new-launch/predix.png' },
  { name: 'Money Heist', img: '/images/home-images/new-launch/money-heist.png' },
  { name: 'Blackjack', img: '/images/home-images/new-launch/blackjack.png' },
  { name: 'Deal or No Deal', img: '/images/home-images/new-launch/deal-or-no-deal.png' },
  { name: 'Instant Rummy', img: '/images/home-images/new-launch/instant-rummy.png' },
  { name: 'Jhandi Munda', img: '/images/home-images/new-launch/jhandi-munda.webp' },
];

export default function NewLaunch() {
  return <HomeGameSection title="New Launch" games={games} />;
}
