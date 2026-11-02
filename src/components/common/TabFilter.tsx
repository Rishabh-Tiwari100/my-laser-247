import { cn } from '@/utils';
import React from 'react';

type TabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  className?: string;
};

const TabFilter: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`flex flex-wrap max-w-max overflow-hidden border-black ${className}`}>
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={cn(
            `flex-1 h-[30px] min-w-max w-44 border text-[11px] sm:text-[13px] font-semibold py-0.5 px-8 border-primary-slate transition ${
              activeTab === tab
                ? 'bg-[#3b5160] text-white'
                : 'bg-white text-primary-slate hover:bg-gray-100'
            }
            ${index === 0 ? 'rounded-tl-md rounded-bl-md' : ''}
            ${index === tabs.length - 1 ? 'rounded-tr-md rounded-br-md' : ''}`
          )}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabFilter;
