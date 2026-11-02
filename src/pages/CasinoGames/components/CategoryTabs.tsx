import { LucideIcon } from 'lucide-react';
import React from 'react';
import { categoryIconMap } from '../constant';
import { cn, formatLabel } from '@/utils';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (label: string) => void;
  className?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  className,
}) => {
  const dragState = React.useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  return (
    <div className={`min-w-0 max-w-full pt-[5px] ${className ?? ''}`}>
      <div
        onMouseDown={(event) => {
          dragState.current = {
            isDragging: false,
            startX: event.pageX,
            scrollLeft: event.currentTarget.scrollLeft,
          };
        }}
        onMouseMove={(event) => {
          if (event.buttons !== 1) return;

          const distance = event.pageX - dragState.current.startX;
          if (Math.abs(distance) < 4) return;

          dragState.current.isDragging = true;
          event.preventDefault();
          event.currentTarget.scrollLeft = dragState.current.scrollLeft - distance;
        }}
        onMouseUp={() => {
          window.setTimeout(() => {
            dragState.current.isDragging = false;
          }, 0);
        }}
        onMouseLeave={() => {
          window.setTimeout(() => {
            dragState.current.isDragging = false;
          }, 0);
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.scrollLeft += event.deltaY;
        }}
        className="scrollbar-hidden min-w-0 max-w-full cursor-grab select-none overflow-x-auto overflow-y-hidden overscroll-x-contain active:cursor-grabbing"
      >
        <ul className="flex w-max min-w-full flex-nowrap rounded-sm border border-primary-theme">
          {categories.map((label, index) => (
            <li
              key={index}
              onClick={() => {
                if (dragState.current.isDragging) return;
                setSelectedCategory(label);
              }}
              className={cn(
                'shadow min-w-[70px] md:min-w-[90px] flex-shrink-0 flex flex-col items-center md:gap-1 px-2 py-1.5 border border-primary-theme text-sm transition font-medium cursor-pointer',
                selectedCategory === label ? 'bg-primary-theme text-white' : ''
              )}
            >
              <img
                src={categoryIconMap[label] || '/images/casino/category/three-cards.svg'}
                alt=""
                className={cn('w-5 h-5 md:w-6 md:h-6 transition')}
              />
              <span className="text-9 md:text-xs whitespace-nowrap">{formatLabel(label)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTabs;
