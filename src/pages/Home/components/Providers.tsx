import React from 'react';
import { Link } from 'react-router-dom';

const providers = [
  { id: 1, name: 'Mac88 Virtuals', img: '/images/home/providers/mac88-virtuals.webp',url:"/casino?provider=Mac88" },
  { id: 2, name: 'Mac88 Live', img: '/images/home/providers/mac88-live.webp',url:"/casino?provider=Mac88" },
  { id: 3, name: 'Mac Excite', img: '/images/home/providers/mac-excite.webp',url:"/casino?provider=Mac88" },
  { id: 4, name: 'Creedroomz', img: '/images/home/providers/creedroomz.png',url:"/casino" },
  { id: 5, name: 'Ezugi Gaming', img: '/images/home/providers/ezugi-gaming.webp',url:"/casino?provider=Ezugi" },
  { id: 6, name: 'Smartsoft', img: '/images/home/providers/smartsoft.webp',url:"/casino" },
  { id: 7, name: 'Turbo Games', img: '/images/home/providers/turbogames.webp',url:"/casino?provider=Turbo Games" },
  { id: 8, name: 'Spribe', img: '/images/home/providers/spribe.webp',url:"/casino?provider=Spribe" },
  { id: 9, name: 'Insta Live', img: '/images/home/providers/insta-live.png',url:"/casino" },
  { id: 10, name: 'Evolution', img: '/images/home/providers/evolution.webp',url:"/casino" },
  { id: 11, name: 'Jili', img: '/images/home/providers/Jili.webp',url:"/casino?provider=JiLi" },
  { id: 12, name: 'MacSexy', img: '/images/home/providers/macsexy.png',url:"/casino" },
  { id: 13, name: 'Gamzix', img: '/images/home/providers/gamzix.webp',url:"/casino" },
  { id: 14, name: 'King Midas', img: '/images/home/providers/king-midas.png',url:"/casino" },
  { id: 15, name: 'All', img: '/images/home/providers/all.png',url:"/casino" },
  { id: 16, name: 'Bet Games', img: '/images/home/providers/bet-games.webp',url:"/casino" },
  { id: 17, name: 'Popok', img: '/images/home/providers/popok.webp',url:"/casino" },
  { id: 18, name: 'Bikini Games', img: '/images/home/providers/bikini-games.webp',url:"/casino" },
];

const Providers = () => {
  return (
    <div className="mt-[2px] lg:mt-[4px]">
      <div className="relative mb-[3px] flex min-w-full w-full items-center bg-[linear-gradient(-180deg,#f72424,#bb1c00)] px-[5px] py-[8px] text-[16px] uppercase leading-[17.6px] text-white">
        <span className="">OUR PROVIDERS</span>
      </div>
      <div className="grid grid-cols-2 gap-[2px] md:grid-cols-4 lg:gap-[4px]">
        {providers.map((provider) => (
          <div key={provider.id} className="relative bg-black">
            <Link to={provider.url} className="block">
              <img src={provider.img} alt={provider.name} className="block aspect-[1.67] w-full object-cover" />
            </Link>
              <div className="relative flex h-[30px] w-full items-center justify-center bg-black text-[12px] font-normal capitalize text-white lg:text-[15px]">
                <Link to={provider.url}>{provider.name}</Link>
                <Link to={provider.url} className="absolute bottom-[2px] right-[4px] flex h-[20px] w-[78px] items-center justify-center overflow-hidden rounded-[3px] border border-[#aaa] bg-white text-[10px] leading-none text-black lg:text-[12px]">
                  Play Now
                  <svg viewBox="0 0 24 24" className="inline size-3">
                    <path fill="#8b0000" d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                  </svg>
                </Link>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Providers;