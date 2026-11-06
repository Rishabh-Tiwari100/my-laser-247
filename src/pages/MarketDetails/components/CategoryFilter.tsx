import { cn } from '@/utils';
import React from 'react';

type TabsProps = {
  tabs: string[];
  category?: 'FANCY' | 'PREMIUM';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
};

const CategoryFilter: React.FC<TabsProps> = ({
  tabs,
  category,
  activeTab,
  setActiveTab,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap max-w-full overflow-hidden text-primary-slate bg-primary-orange border-black items-center',
        className,
        category === 'FANCY' && 'bg-white bg-fancy-gradient border-t border-t-slate/5',
        category === 'PREMIUM' && 'bg-primary-orange border-t border-t-slate/5'
      )}
    >
      <div className="flex w-full items-center overflow-x-auto bg-gradient-to-b from-[#0a92a5] from-[15%] to-[#076875] p-[2px] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="min-w-fit flex-1 bg-[#e3fcff75] p-[2px] leading-none first:rounded-l-[5px] last:rounded-r-[5px]"
          >
            <button
              type="button"
              className={cn(
                `relative w-full whitespace-nowrap px-[8px] text-[12px] font-bold text-[#243a48] ${activeTab === tab ? 'rounded-[5px] bg-white' : ''}`
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
