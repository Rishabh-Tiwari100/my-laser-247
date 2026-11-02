import React from 'react';
import { Link } from 'react-router-dom';

const providers = [
  { id: 1, name: 'Mac88 Virtuals', img: '/images/home/providers/mac88-virtuals.webp' },
  { id: 2, name: 'Mac88 Live', img: '/images/home/providers/mac88-live.webp' },
  { id: 3, name: 'Mac Excite', img: '/images/home/providers/mac-excite.webp' },
  { id: 4, name: 'Creedroomz', img: '/images/home/providers/creedroomz.png' },
  { id: 5, name: 'Ezugi Gaming', img: '/images/home/providers/ezugi-gaming.webp' },
  { id: 6, name: 'Smartsoft', img: '/images/home/providers/smartsoft.webp' },
  { id: 7, name: 'Turbo Games', img: '/images/home/providers/turbogames.webp' },
  { id: 8, name: 'Spribe', img: '/images/home/providers/spribe.webp' },
  { id: 9, name: 'Insta Live', img: '/images/home/providers/insta-live.png' },
  { id: 10, name: 'Evolution', img: '/images/home/providers/evolution.webp' },
  { id: 11, name: 'Jili', img: '/images/home/providers/Jili.webp' },
  { id: 12, name: 'MacSexy', img: '/images/home/providers/macsexy.png' },
  { id: 13, name: 'Gamzix', img: '/images/home/providers/gamzix.webp' },
  { id: 14, name: 'King Midas', img: '/images/home/providers/king-midas.png' },
  { id: 15, name: 'All', img: '/images/home/providers/all.png' },
  { id: 16, name: 'Bet Games', img: '/images/home/providers/bet-games.webp' },
  { id: 17, name: 'Popok', img: '/images/home/providers/popok.webp' },
  { id: 18, name: 'Bikini Games', img: '/images/home/providers/bikini-games.webp' },
];

const Providers = () => {
  return (
    <div>
      <div className="relative bg-[linear-gradient(-180deg,#f72424,#bb1c00)] text-white flex items-center min-w-full w-full uppercase p-[5px] text-[15px] leading-[1.5]">
        <span className="">OUR PROVIDERS</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {providers.map((provider) => (
          <div key={provider.id} className="relative mb-1 bg-black">
            <Link to={`/providers/${provider.id}`}>
              <img src={provider.img} alt={provider.name} className="img-fluid" />
              <h2 className="relative z-[4] bottom-0 left-0 w-full h-[30px] justify-center capitalize text-white text-[15px] items-center pl-[10px] font-medium flex">
                {provider.name}{' '}
                <Link to={`/providers/${provider.id}`} className="home-animated text-xs">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Play Now
                  <svg viewBox="0 0 24 24" className="size-4 inline">
                    <path fill="#8b0000" d="M8,5.14V19.14L19,12.14L8,5.14Z"></path>
                  </svg>
                </Link>
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Providers;
