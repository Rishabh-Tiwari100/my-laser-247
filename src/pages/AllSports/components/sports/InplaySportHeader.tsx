import { FaCheck, FaPlus } from 'react-icons/fa6';
import { SportMatchFilter } from '../../helpers/sportMatchFilter';

interface InplaySportHeaderProps {
  title: string;
  activeFilter: SportMatchFilter;
  onFilterChange: (filter: SportMatchFilter) => void;
}

const InplaySportHeader = ({ title, activeFilter, onFilterChange }: InplaySportHeaderProps) => {
  const renderFilterButton = (filter: Exclude<SportMatchFilter, 'all'>, label: string) => {
    const isActive = activeFilter === filter;

    return (
      <button
        type="button"
        aria-pressed={isActive}
        onClick={() => onFilterChange(isActive ? 'all' : filter)}
        className={`flex items-center justify-center rounded-[25px] border px-2.5 text-[12px] font-semibold leading-5 whitespace-nowrap ${
          isActive
            ? 'border-[#00ad78] bg-[#00ad78] text-white'
            : 'border-white bg-transparent text-white'
        }`}
      >
        {isActive ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
        {label}
      </button>
    );
  };

  return (
    <div className="flex h-[31px] items-center justify-between bg-[#203946] px-2 text-xs font-bold text-white">
      <span>{title}</span>
      <div className="flex items-center gap-[2px]">
        {renderFilterButton('live', 'LIVE')}
        {renderFilterButton('virtual', 'VIRTUAL')}
      </div>
    </div>
  );
};

export default InplaySportHeader;
