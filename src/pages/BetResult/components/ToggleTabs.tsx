import { cn } from '@/utils';

interface ToggleTabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

function ToggleTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  activeClassName = 'bg-primary-dark2 text-white',
  inactiveClassName = 'bg-white text-black hover:bg-gray-100',
}: ToggleTabsProps<T>) {
  return (
    <div
      className={`inline-flex self-start rounded-md overflow-hidden border border-primary-dark2 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            `px-5 sm:px-6 py-1.5 text-sm font-semibold transition`,
            activeTab === tab ? activeClassName : inactiveClassName
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default ToggleTabs;
