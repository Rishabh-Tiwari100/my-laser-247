import { cn } from '@/utils';

const HowToWorkCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl overflow-hidden flex flex-col shadow-md shadow-gray-500',
        className
      )}
    >
      <div className=" px-4 py-2 font-semibold">How To Work</div>

      <div className="flex-1 bg-gray-100 rounded-t-3xl p-4 py-10 space-y-2 text-sm flex flex-col justify-between">
        <div className="space-y-4">
          <p>
            <span className="text-gray-500 pr-1 text-13">01</span>{' '}
            <span className="font-semibold">Instant Bonus</span> -{' '}
            <span className="text-13">Earn 50% of first deposit</span>
          </p>
          <p>
            <span className="text-gray-500 text-13 pr-1">02</span>{' '}
            <span className="font-semibold">Passive Income</span> -{' '}
            <span className="text-13">Earn 10% commission weekly</span>
          </p>
          <p>
            <span className="text-gray-500 pr-1 text-13">03</span>{' '}
            <span className="font-semibold">New User Bonus</span> -{' '}
            <span className="text-13">Friend gets 30% bonus</span>
          </p>
        </div>

        <div className=" text-center text-xl font-bold text-green-600 mt-4">
          <img src="/images/reward.png" alt="" className="w-[220px] mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default HowToWorkCard;
