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
      <div className="bg-gradient-to-b from-[#0a92a5] from-[15%] to-[#076875] flex-wrap overflow-x-auto flex items-center p-[2px] w-full">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="first:rounded-l-[5px] last:rounded-r-[5px] bg-[#e3fcff75] p-[2px] leading-none"
          >
            <button
              type="button"
              className={cn(
                `w-full text-nowrap text-xs px-2.5 uppercase relative font-black text-[#243a48] ${activeTab === tab ? 'bg-white underline rounded-[5px]' : ''}`
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
