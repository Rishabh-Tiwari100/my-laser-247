import React, { useState } from 'react';

const tabs = [
  { id: 'Cricket', label: 'Cricket' },
  { id: 'Football', label: 'Soccer' },
  { id: 'Tennis', label: 'Tennis' },
];
interface TabsNavigationProps {
  activeTab: 'Cricket' | 'Football' | 'Tennis';
  onChange: (tab: 'Cricket' | 'Football' | 'Tennis') => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, onChange }) => {
  return (
    <div className="border border-t-[#243a48] border-t-0">
      <div className="bg-[#ffb300] px-2 pt-[2px]">
        <div className="flex gap-[2px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id as 'Cricket' | 'Football' | 'Tennis')}
              className={`min-w-[130px] h-[22px] border border-[#4a4a4a65] border-b-0 text-[13px] rounded-tl-md rounded-tr-md
                ${activeTab === tab.id ? 'bg-[#dddcd6] text-black' : 'bg-[#324b60] text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
