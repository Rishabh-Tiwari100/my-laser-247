import React from 'react';
// import { AlertTriangle } from 'lucide-react';
// import { Icons } from '@/utils/icons';

interface TurnoverCardProps {
  depositAmount: number;
  progress: number; // 0–100
  required: number;
  completed: number;
  remaining: number;
  message: string;
}

const TurnoverCard: React.FC<TurnoverCardProps> = ({
  depositAmount,
  progress,
  required,
  completed,
  remaining,
  message,
}) => {
  return (
    <div className="rounded-xl bg-white p-3 border border-primary-light shadow-md">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            🏦
          </div>

          <div>
            <p className="font-semibold text-sm">Deposit Turnover</p>
            <p className="text-xs text-gray-500">Must be Completed first</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Deposit</p>
          <p className="font-semibold">৳{depositAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-green-100 overflow-hidden">
          <div
            className="h-full bg-primary-light rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 mt-4 text-xs">
        <div className="text-left">
          <p className="font-semibold">৳{required.toLocaleString()}</p>
          <p className="text-11 text-gray-500">Required</p>
        </div>

        <div className="text-center">
          <p className="font-semibold text-blue-600">৳{completed.toLocaleString()}</p>
          <p className="text-11 text-gray-500">Completed</p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-red-500">৳{remaining.toLocaleString()}</p>
          <p className="text-11 text-gray-500">Remaining</p>
        </div>
      </div>

      {/* INFO */}
      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 px-2 py-2 text-xs text-black">
          {/* <Icons.warning  className='shrink-0 w-5 h-5 text-yellow-600'/>
        <span className='text-black text-11'>Complete deposit turnover before bonus turnover begins</span> */}
          {message}
        </div>
      )}
    </div>
  );
};

export default TurnoverCard;
