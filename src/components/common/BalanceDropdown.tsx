import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatNumber } from '@/utils';

export interface BalanceDropdownProps {
  formattedTotalBalance: string;
  formattedWithdrawableBalance: string;
  formattedExposure: string;
}

export default function BalanceDropdown({
  formattedTotalBalance,
  formattedWithdrawableBalance,
  formattedExposure,
}: BalanceDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex sm:hidden items-center gap-x-2">
      <div ref={dropdownRef} className="relative w-full min-w-[100px] max-w-[145px]">
        {/* MAIN BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="text-11 flex items-center justify-between w-full border border-primary-light rounded-md px-2 py-1 bg-white shadow-sm active:scale-[0.98] transition"
        >
          <span className="text-gray-400 font-medium border-r-2 pr-1 border-r-primary text-11">
            <img src="/images/taka-green.webp" alt="" className="w-5" />
          </span>

          <span className="text-primary font-semibold ml-1">{formattedTotalBalance}</span>

          <span className="ml-1">
            {open ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )}
          </span>
        </button>

        {/* DROPDOWN LIST */}
        {open && (
          <div className="p-1 text-11 text-black absolute right-0 mt-1 w-full bg-white border border-primary-light rounded-md shadow-md z-50 flex flex-col gap-y-1">
            <div className="hover:bg-gray-100 flex justify-between items-center border rounded-sm px-0.5 py-1 bg-primary/10">
              <span className="text-10 font-medium text-gray-600">Main Bal:</span>
              <span className="text-primary font-semibold">{formattedTotalBalance}</span>
            </div>

            <div className="hover:bg-gray-100 flex justify-between items-center border rounded-sm px-0.5 py-1 bg-primary/10">
              <span className="text-10 font-medium text-gray-600">Wdr. Bal:</span>
              <span className="text-primary font-semibold">{formattedWithdrawableBalance}</span>
            </div>

            <div className="hover:bg-gray-100 flex justify-between items-center border rounded-sm px-0.5 py-1 bg-primary/10">
              <span className="text-10 font-medium text-gray-600">Exposure:</span>
              <span className="text-primary font-semibold">{formattedExposure}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
