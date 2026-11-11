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
        'w-full min-w-0 max-w-full overflow-hidden border-x border-[#7e97a7]',
        category === 'FANCY' && 'border-t border-t-slate/5',
        className
      )}
    >
      <div className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap bg-gradient-to-b from-[#0a92a5] from-[15%] to-[#076875] p-[2px] text-left font-helvetica text-[14px] font-normal leading-[21px] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="inline-flex bg-[#e3fcff75] align-baseline first:rounded-l-[5px] last:rounded-r-[5px]"
          >
            <button
              type="button"
              aria-pressed={activeTab === tab}
              className={cn(
                'relative m-[2px] block whitespace-nowrap rounded-[5px] px-[6px] text-[12px] font-black capitalize leading-[18px] hover:text-[#343a40] hover:underline lg:px-[22px]',
                activeTab === tab ? 'bg-white text-black' : 'text-[#243a48]'
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
