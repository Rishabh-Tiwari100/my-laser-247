import { valueFormatter } from '@/utils';
import React from 'react';

const TossMarket = ({ data, min, max }: any) => {
  return (
    <div>
      {' '}
      <div className="">
        <div className="grid grid-cols-12 border border-[#7e97a7] text-white">
          <div className="col-span-12">
            <p className="uppercase h-[30px] text-white font-semibold pr-[30px] pl-[10px] relative text-xs bg-primary-theme flex items-center">
              <span className="max-w-[160px] leading-[normal]">{data?.marketName}</span>
              <span className="text-[10px] leading-[normal]"></span>
            </p>
          </div>
        </div>
        <div className="">
          <div className="grid items-center border border-[#7e97a7] text-white grid-cols-12">
            <div className="col-span-7 md:col-span-5">
              <div className="p-[2px] block lg:hidden text-center text-black">
                <dl className="p-[5px] bg-[#bed5d8] leading-[11px] rounded-[1px] text-left">
                  <dt className="text-[9px] text-[#315195] inline-block mr-2 font-bold">Min/Max</dt>
                  <dd className="text-[9px] inline-block">
                    {min ? valueFormatter.format(Number(min)) : ''} -
                    {max ? valueFormatter.format(Number(max)) : ''}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="col-span-5 md:col-span-7">
              <div className="rounded-[6px] w-full grid grid-cols-12 md:gap-[2px] text-black">
                <button className="text-[13px] capitalize col-span-2 font-semibold h-[42.2px] py-1 border-none max-lg:hidden"></button>
                <button className="text-[13px] capitalize col-span-2 font-semibold h-[42.2px] py-1 border-none max-lg:hidden"></button>
                <button className="text-[13px] capitalize col-span-6 lg:col-span-2 font-semibold h-[42.2px] py-1 border-none bg-[#72bbef] rounded-tl-[12px] my-[2px]">
                  Back
                </button>
                <button className="text-[13px] capitalize col-span-6 lg:col-span-2 font-semibold h-[42.2px] py-1 border-none bg-[#faa9ba] rounded-tr-[12px] my-[2px]">
                  Lay
                </button>
                <button className="text-[13px] capitalize col-span-4 font-semibold h-[42.2px] py-1 border-none px-[3px] max-lg:hidden">
                  <dl className="text-center p-[5px] bg-[#bed5d8] leading-[11px] rounded-[1px]">
                    <dt className="text-[9px] text-[#315195] inline-block mr-2 font-bold">
                      Min/Max
                    </dt>
                    <dd className="inline-block text-[9px]">
                      {min ? valueFormatter.format(Number(min)) : ''} -
                      {max ? valueFormatter.format(Number(max)) : ''}
                    </dd>
                  </dl>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TossMarket;
