import { useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type ViewByOption = 'Competition' | 'Time';

const options: ViewByOption[] = ['Competition', 'Time'];

interface ViewByDropdownProps {
  selected: ViewByOption;
  onChange: (option: ViewByOption) => void;
}

export default function ViewByDropdown({ selected, onChange }: ViewByDropdownProps) {
  const isDashboard = useLocation().pathname === '/dashboard';
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn("flex items-center gap-1 rounded-t-sm bg-[linear-gradient(-180deg,#f72424,#bb1c00)] py-[3px] px-1 rounded-[2px] text-xs font-semibold uppercase text-white", isDashboard && "min-h-[23px] gap-[3px] px-[6px] py-0 text-[11px] font-normal lg:min-h-[22px] lg:px-1 lg:py-[3px] lg:text-xs")}
      >
        View By
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-[2px] w-40 overflow-hidden rounded-b shadow-lg border border-gray-300 bg-white">
          {options.map((item) => (
            <button
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-center px-4 py-2 text-xs font-bold transition ${isDashboard ? 'min-h-[23px] gap-[3px] px-[6px] py-0 text-[11px] font-normal lg:min-h-[22px] lg:px-4 lg:py-2 lg:text-xs' : ''}
                ${
                  selected === item
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
