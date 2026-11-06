export const SPORT_FILTER_LIST = ['Cricket', 'Football', 'Tennis'];

export const CASINO_IMAGES: Record<
  string,
  { key: string; image: string; isVideo?: boolean; poster?: string }[]
> = {
  Trending: [
    {
      key: 'plinko',
      image: '/images/home/trending/videos/plinko.webm',
      isVideo: true,
      poster: '/images/home/trending/plinko.webp',
    },
    {
      key: 'funky-time',
      image: '/images/home/trending/videos/funky-time.webm',
      poster: '/images/home/trending/funky-time.webp',
      isVideo: true,
    },
    {
      key: 'nft-aviatrix',
      image: '/images/home/trending/videos/aviatrix.webm',
      isVideo: true,
      poster: '/images/home/trending/aviatrix.webp',
    },
    {
      key: 'crazy777',
      image: '/images/home/trending/videos/crazy777.webm',
      isVideo: true,
      poster: '/images/home/trending/crazy777.webp',
    },
    {
      key: 'fortune-gems-2',
      image: '/images/home/trending/videos/fortune-gems-500.webm',
      isVideo: true,
      poster: '/images/home/trending/fortune-gems-500.webp',
    },
    {
      key: 'sweet-bonanza',
      image: '/images/home/trending/videos/sweet-bonanza.webm',
      isVideo: true,
      poster: '/images/home/trending/sweet-bonanza-win-big.webp',
    },
    {
      key: 'color-game',
      image: '/images/home/trending/videos/Color-game.webm',
      isVideo: true,
      poster: '/images/home/trending/color-games.webp',
    },
    {
      key: 'andar-bahar',
      image: '/images/home/trending/videos/Andar-bahar.webm',
      isVideo: true,
      poster: '/images/home/trending/andar-bahar.webp',
    },
    {
      key: 'teen-patti-20-20',
      image: '/images/home/trending/videos/teenPatti-20-20.webm',
      isVideo: true,
      poster: '/images/home/trending/teenpatti20-20.webp',
    },
    {
      key: 'mines',
      image: '/images/home/trending/videos/Mines.webm',
      isVideo: true,
      poster: '/images/home/trending/mines.webp',
    },
  ],

  'Most Played': [
    {
      key: 'aviator',
      image: '/images/home/most-played/videos/Aviatrix.webm',
      isVideo: true,
      poster: '/images/home/most-played/aviator.webp',
    },
    {
      key: 'fortune-gems',
      image: '/images/home/most-played/videos/fortune-gems-500.webm',
      isVideo: true,
      poster: '/images/home/most-played/fortune-gems.webp',
    },
    {
      key: 'super-ace',
      image: '/images/home/most-played/videos/Super-ace.webm',
      isVideo: true,
      poster: '/images/home/most-played/super-ace.webp',
    },
    {
      key: 'sic-bo',
      image: '/images/home/most-played/videos/Sic-bo.webm',
      isVideo: true,
      poster: '/images/home/most-played/sic-bo.webp',
    },
    {
      key: 'one-card-meter',
      image: '/images/home/most-played/videos/Card-matka.webm',
      isVideo: true,
      poster: '/images/home/most-played/card-matka.webp',
    },
    {
      key: 'coin-toss',
      image: '/images/home/most-played/videos/Coin-toss.webm',
      isVideo: true,
      poster: '/images/home/most-played/coin-toss.webp',
    },
    {
      key: 'crazy-time',
      image: '/images/home/most-played/videos/Crazy-time.webm',
      isVideo: true,
      poster: '/images/home/most-played/crazy-time.webp',
    },
    {
      key: 'dragon-tiger',
      image: '/images/home/most-played/videos/Dragon-tiger.webm',
      isVideo: true,
      poster: '/images/home/most-played/dragon-tiger.webp',
    },
    {
      key: 'speed-baccarat',
      image: '/images/home/most-played/videos/Speed-Baccarat.webm',
      isVideo: true,
      poster: '/images/home/most-played/speed-baccarat.webp',
    },
  ],

  'International Casino': [
    { key: 'vip-blackjack', image: '/images/home/international/vip-blackjack.webp' },
    { key: 'vr-29-card-baccarat', image: '/images/home/international/player-banker-baccarat.webp' },
    { key: 'sexybcrt-lobby', image: '/images/home/international/ae-sexy.webp' },
    { key: 'red-door-roulette', image: '/images/home/international/red-door-roulette.webp' },
    { key: 'crazy-coin-flip', image: '/images/home/international/crazy-coin-flip.webp' },
    { key: 'lightning-storm', image: '/images/home/international/lightning-strom.webp' },
    { key: 'mega-ball', image: '/images/home/international/megaball-100x.webp' },
  ],

  'Indian Casino': [
    { key: 'two-card-teenpatti', image: '/images/home/indian/two-card-teenpatti.webp' },
    { key: 'poker-20-20', image: '/images/home/indian/poker20-20.webp' },
    { key: 'auto-roulette', image: '/images/home/indian/auto-roulette.webp' },
    { key: '6-player-poker', image: '/images/home/indian/six-player-poker.webp' },
    { key: 'lucky-7', image: '/images/home/indian/lucky7.webp' },
    { key: 'lottery', image: '/images/home/indian/lottery.webp' },
    { key: 'dragon-tiger-lion', image: '/images/home/indian/dragon-tiger-lion.webp' },
    { key: 'test-teenpatti', image: '/images/home/indian/test-teenpatti.webp' },
  ],

  'Live Casino': [
    { key: 'crazy-time', image: '/images/home/live/crazy-time.webp' },
    { key: 'mega-wheel', image: '/images/home/live/mega-wheel.webp' },
    { key: 'sexybcrt-lobby', image: '/images/home/live/sexy-baccarat.webp' },
    { key: 'super-sic-bo', image: '/images/home/live/super-sic-bo.webp' },
    { key: 'dragon-tiger', image: '/images/home/live/dragon-tiger-lion.webp' },
    { key: 'teen-patti-20-20', image: '/images/home/live/teenpatti-20.webp' },
    { key: 'speed-baccarat', image: '/images/home/live/speed-baccarat.webp' },
    { key: 'funky-time', image: '/images/home/live/funky-time.webp' },
  ],

  Table: [
    { key: 'number-king', image: '/images/home/table/number-king.webp' },
    { key: 'hilo', image: '/images/home/table/hilo.webp' },
    { key: 'callbreak-quick', image: '/images/home/table/call-break.webp' },
    { key: 'rummy', image: '/images/home/table/rummy.webp' },
    { key: 'baccarat-deluxe', image: '/images/home/table/baccarat-deluxe.webp' },
    { key: '32-cards', image: '/images/home/table/cards-32.webp' },
    { key: 'bonus-dice', image: '/images/home/table/bonus-dice.webp' },
    { key: 'mini-roulette', image: '/images/home/table/mini-roulette.webp' },
  ],

  Slots: [
    { key: 'super-ace', image: '/images/home/slots/super-ace.webp' },
    { key: 'fortune-gems-3', image: '/images/home/slots/fortune-gems.webp' },
    { key: 'callbreak-quick', image: '/images/home/slots/call-break.webp' },
    { key: 'super-niubi', image: '/images/home/slots/super-niubi.webp' },
    { key: 'fruity-bonanza', image: '/images/home/slots/fruity-bonanza.webp' },
    { key: 'fortune-dragon', image: '/images/home/slots/fortune-dragon.webp' },
    { key: 'boxing-king', image: '/images/home/slots/boxing-king.webp' },
    { key: 'fortune-gems', image: '/images/home/slots/fortune-gems.webp' },
  ],

  Crash: [
    { key: 'aviator', image: '/images/home/crash/aviator.webp' },
    { key: 'jetx', image: '/images/home/crash/avia-bet.webp' },
    { key: 'nft-aviatrix', image: '/images/home/crash/aviator.webp' },
    { key: 'cricketx', image: '/images/home/crash/cricketx.webp' },
    { key: 'plinko-rush', image: '/images/home/crash/plinko-cup.webp' },
    { key: 'limbo', image: '/images/home/crash/limbo-casino.webp' },
    { key: 'avia-rush', image: '/images/home/crash/avia-bet.webp' },
  ],
};

export const WebHomeBannerFallback = [
  {
    image: '/images/home/slide1.png',
    type: 'HomeBanner',
  },
  {
    image: '/images/home/slide2.jpg',
    type: 'HomeBanner',
  },
];

export const AppHomeBannerFallback = [
  {
    image: '/images/home/mobile.png',
    type: 'HomeBanner',
  },
];

export const WebWelcomeBannerFallback = [
  { type: 'webWelcomeBanner', image: '/images/home/desktop-welcome.jpg' },
];
export const AppWelcomebannerFallback = [
  { type: 'appWelcomeBanner', image: '/images/home/app-welcome.png' },
];

export const homeNavigations = [
  { label: 'Cricket', href: '/sports/cricket' },
  { label: 'Football', href: '/sports/football' },
  { label: 'Tennis', href: '/sports/tennis' },
  { label: 'Casino', href: '/casino' },
  { label: 'Fantasy 11', href: '#', highlight: true },
  { label: 'Cock Fight', href: '#' },
  { label: 'SB', href: '#' },
  { label: 'Predix', href: '#' },
];

export const casinoTabs: { title: string; value: string; type: string }[] = [
  { title: 'More Slots', value: 'Slot Game', type: 'category' },
  { title: 'Slot', value: 'Slot', type: 'category' },
  { title: 'Royal Games', value: 'Royal Gaming', type: 'provider' },
  { title: 'Video Poker', value: 'Video Poker', type: 'search' },
  { title: 'Mac88', value: 'Mac88', type: 'provider' },
  { title: 'Video Slots', value: 'Video Slots', type: 'category' },
  { title: 'Aura', value: 'Aura', type: 'not-available' },
  { title: 'Colour Prediction', value: 'Color Prediction', type: 'search' },
  { title: 'Aviator', value: 'Aviator', type: 'search' },
  { title: 'Virtual Casino', value: 'Virtual Casino', type: 'category' },
  { title: 'Crash', value: 'Crash Game', type: 'category' },
  { title: 'Marbles Race', value: 'Marble Race', type: 'search' },
  { title: 'Mini Roulette', value: 'Mini Roulette', type: 'search' },
  { title: 'Roulette', value: 'Roulette', type: 'category' },
  { title: 'Andar Bahar', value: 'Andar Bahar', type: 'search' },
  { title: 'Dragon Tiger', value: 'Dragon Tiger', type: 'category' },
  { title: 'Teen Patti', value: 'Teen Patti', type: 'search' },
  { title: 'Game Shows', value: 'Game Show', type: 'category' },
  { title: 'Sic Bo', value: 'SicBo', type: 'category' },
  { title: 'Lighting', value: 'Lighting', type: 'search' },
  { title: 'Casual', value: 'Casual Games', type: 'category' },
  { title: 'Rummy', value: 'Rummy', type: 'search' },
  { title: 'Baccarat', value: 'Baccarat', type: 'category' },
  { title: 'Blackjack', value: 'Blackjack', type: 'category' },
  { title: 'Other', value: 'Other Live Games', type: 'category' },
  { title: 'Arcade', value: 'Arcade Games', type: 'category' },
  { title: 'Poker', value: 'Poker', type: 'category' },
  { title: 'Bingo', value: 'Bingo', type: 'category' },
  { title: 'Popular Games', value: 'Popular Games', type: 'search' },
  { title: 'Fishing', value: 'Fishing', type: 'search' },
  { title: 'Mines', value: 'Mines', type: 'search' },
  { title: 'Fun Games', value: 'Fun Games', type: 'search' },
  { title: 'Lucky7', value: 'Lucky7', type: 'search' },
  { title: 'Lottery', value: 'Lottery', type: 'search' },
  { title: '32 Cards', value: '32 Cards', type: 'search' },
  { title: 'Hi Low', value: 'Hi Lo', type: 'search' },
  { title: 'Scratch Games', value: 'Scratch Card', type: 'category' },
  { title: 'Keno', value: 'Keno', type: 'search' },
  { title: 'Hold Spin', value: 'Hold The Spin', type: 'search' },
  { title: 'Virtual Sport', value: 'Virtual', type: 'category' },
  { title: 'Kingmaker', value: 'Kingmaker', type: 'provider' },
  { title: 'Turbo Games', value: 'Turbo Games', type: 'provider' },
  { title: 'Chicken Games', value: 'Chicken', type: 'search' },
  { title: 'Colour Games', value: 'Color', type: 'search' },
];
