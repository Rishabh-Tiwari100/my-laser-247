// components/SportsFilterBar.tsx

import { useEffect, useRef, useState } from 'react';

interface SportsFilterBarProps {
  sports: string[];
  selectedSports: string[];
  onChange: (sports: string[]) => void;
  activeSport?: string;
  onSelectSport?: (sport: string) => void;
  onFilterClick?: () => void;
  className?: string;
}

const SportsFilterBar = ({
  sports,
  activeSport,
  selectedSports,
  onChange,
  onSelectSport,
  onFilterClick,
  className = '',
}: SportsFilterBarProps) => {
  const [tempSelectedSports, setTempSelectedSports] = useState(selectedSports);
  const [openPopup, setOpenPopup] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpenPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openPopup) {
      setTempSelectedSports(selectedSports);
    }
  }, [openPopup, selectedSports]);

  const toggleSport = (sport: string) => {
    setTempSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  return (
    <div
      className={`flex items-center justify-between border border-gray-300 bg-[#e0e6e6] border-b border-b-[#7e97a7] p-2.5 mb-3 ${className}`}
    >
      {/* Left Section */}
      <div className="flex items-center flex-wrap gap-1 text-xs">
        <span className="font-semibold text-black">Sports Filters:</span>

        {selectedSports.map((sport, index) => (
          <div key={sport} className="ml-2 flex items-center">
            <button
              onClick={() => onSelectSport?.(sport)}
              className={`text-xs transition-colors ${
                activeSport === sport ? 'text-black font-medium' : 'text-[#243a48] hover:text-black'
              }`}
            >
              {sport === 'Football' ? 'Soccer' : sport}
            </button>

            {index !== selectedSports.length - 1 && <span className="ml-2 text-gray-400">•</span>}
          </div>
        ))}
      </div>

      <div className="relative" ref={popupRef}>
        <button
          onClick={() => setOpenPopup((prev) => !prev)}
          className="relative min-w-[88px] h-[32px] px-3 border border-slate-500/50 rounded text-xs text-black bg-btn-gradient hover:bg-btn-gradient-hover"
        >
          Filter
        </button>
        {openPopup && (
          <div className="absolute top-[140%] right-0 w-[500px] rounded-md border border-gray-300 bg-white shadow-[-1px_4px_8px_0px_rgba(0,0,0,0.7)] pt-2 p-4 z-50">
            {/* Arrow */}
            <div className="absolute -top-2 right-8 h-4 w-4 rotate-45 border-l border-t border-gray-300 bg-white" />

            {/* Checkbox Grid */}
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              {['All', 'Football', 'Tennis', 'Cricket'].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      item === 'All'
                        ? tempSelectedSports.length === sports.length
                        : tempSelectedSports.includes(item)
                    }
                    onChange={() => {
                      if (item === 'All') {
                        setTempSelectedSports(
                          tempSelectedSports.length === sports.length ? [] : [...sports]
                        );
                      } else {
                        toggleSport(item);
                      }
                    }}
                  />
                  {item === 'Football' ? 'Soccer' : item}
                </label>
              ))}
            </div>
            {/* Divider */}
            <div className="my-2 border-t border-gray-200" />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onChange(tempSelectedSports);
                  setOpenPopup(false);
                }}
                className="flex-1 py-1 rounded text-[#1e1e1e] font-bold max-w-24 px-4 bg-gradient-to-b from-[#FFB80C] to-[#FFA00C] hover:from-[#FFA00C] hover:to-[#FFB80C] text-xs"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setTempSelectedSports(selectedSports);
                  setOpenPopup(false);
                }}
                className="flex-1 py-1 rounded border max-w-24 border-gray-500/50  bg-btn-gradient hover:bg-btn-gradient-hover text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SportsFilterBar;
