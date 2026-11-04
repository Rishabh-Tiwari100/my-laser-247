import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/hooks/useSidebar';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reserveDesktopSpace?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  reserveDesktopSpace = true,
}) => {
  const { competitions, competitionsLoading, menuItems, handleSelectSport } = useSidebar({
    setIsSidebarOpen,
  });

  const [expandedSport, setExpandedSport] = useState<string | null>(null);

  const toggleSport = (sport: string) => {
    setExpandedSport((prev) => (prev === sport ? null : sport));
  };

  const normalizeSportName = (sport: string) =>
    sport.toLowerCase() === 'football' ? 'soccer' : sport.toLowerCase();

  return (
    <div
      className={
        reserveDesktopSpace
          ? 'contents lg:block lg:w-[240px] lg:shrink-0'
          : 'contents'
      }
    >
      <div
        className={`fixed top-0 left-0 z-[100] h-screen w-[240px] p-[100px_0_70px] bg-white border-r border-gray-300 font-tahoma shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:shadow-none`}
      >
        <div className="h-full overflow-hidden scrollbar-hidden">
          {menuItems.map((sport) => {
            const sportName = sport.label === 'Football' ? 'Soccer' : sport.label;

            const sportCompetitions = competitions.filter(
              (competition) =>
                normalizeSportName(competition.sport) === normalizeSportName(sportName)
            );

            const isOpen = expandedSport === sport.label;

            return (
              <div key={sport.label}>
                {/* Sport */}
                <button
                  onClick={() => {
                    toggleSport(sport.label);
                    handleSelectSport(sport.label);
                  }}
                  className="flex items-center justify-between w-full px-[14px] py-2 text-[13px] border-b border-[#ededed] hover:bg-[#ededed] transition-colors"
                >
                  <span>{sport.label}</span>

                  {isOpen ? (
                    <ChevronDown size={16} className="border border-black rounded-[2px] p-px" />
                  ) : (
                    <ChevronRight size={16} className="border border-black rounded-[2px] p-px" />
                  )}
                </button>

                {/* Competitions */}
                {isOpen && (
                  <div className="bg-white">
                    {competitionsLoading ? (
                      <div className="flex justify-center items-center py-6">
                        <Loader2 size={18} className="animate-spin text-gray-400" />
                      </div>
                    ) : sportCompetitions.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-gray-500">
                        No competitions available
                      </div>
                    ) : (
                      sportCompetitions.map((competition) => (
                        <NavLink
                          key={competition.id}
                          to={`/sports/${
                            normalizeSportName(competition.sport) === 'soccer'
                              ? 'football'
                              : competition.sport.toLowerCase()
                          }/${competition.id}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className="block font-normal text-xs p-[10px_2px_6px_17px] border-b border-white bg-[#ededed]"
                        >
                          <span className="truncate">{competition.name}</span>
                        </NavLink>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
