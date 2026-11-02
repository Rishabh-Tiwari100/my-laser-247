import React from 'react';

type TabsProps = {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTabColor?: string;
  className?: string;
  buttonClassName?: string;
};

const TabFilterTwo: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  className = '',
  buttonClassName = 'min-w-32',
  activeTabColor = 'bg-gradient-secondary',
}) => {
  return (
    <div
      className={`my-2 flex gap-x-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`uppercase rounded-full text-sm font-semibold py-1.5 px-3 transition ${
            activeTab === tab
              ? `text-white ${activeTabColor}`
              : 'bg-white text-black hover:bg-gray-100 border border-black'
          } ${buttonClassName}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabFilterTwo;
