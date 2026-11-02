import { useGetMultiMarketQuery } from '@/store/api/eventsApi';
import React from 'react';
import NormalMarket from './components/NormalMarket';
import { getDisplayMarket } from './helpers';
import { useNavigate } from 'react-router-dom';

const MultiMarket = () => {
    const { data } = useGetMultiMarketQuery();
    const events = data?.catalogue ?? [];
    const navigate = useNavigate();

    if (!events.length) {
        return (
            <div className="mt-[4vh] w-[95%] mx-auto rounded-[1.6vw] border border-[#7e97a7] p-[2.66667vw_1.86667vw_5.33333vw] text-center text-[4.26667vw]">
                <h3 className="mb-[1.33333vw] mt-[10px] flex items-center justify-center border-b border-[#e0e6e6] py-[1.86667vw] text-[19px] leading-[1.6] text-[#7e97a7] before:mr-[1.33333vw] before:h-[35px] before:w-[35px] before:bg-[url('/icons/nodata.svg')] before:bg-contain before:bg-left-top before:bg-no-repeat before:content-[''] md:text-[18px]">
                    There are currently no followed multi markets.
                </h3>
                <p className="mb-4 text-[4.26667vw] text-[#7e97a7] md:text-[28px]">
                    Please add some markets from events.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1 lg:w-[87%]">
            {events.map((event) => {
                const matchData = getDisplayMarket(event?.markets as any);
                console.log('matchData', matchData);
                return (
                    <div key={event.id} className="">
                        {matchData ? <div>
                            <div className="bg-black text-white flex items-center justify-between p-[5px] text-[15px]"><div>{event?.eventName}</div> <div onClick={() => navigate(`/sports/cricket/${event?.competitionId}/market-details/${event.id}`)} className="cursor-pointer"><img className="max-w-[13px]" src="/icons/arrow-right.svg" alt="" /></div></div>
                            <NormalMarket eventId={event.id} data={matchData as any} min={Number(matchData?.minBetAmount
                                ?? 0)} max={Number(matchData?.maxBetAmount ?? 0)} /></div> : null}
                    </div>
                );
            })}
        </div>
    );
};

export default MultiMarket;