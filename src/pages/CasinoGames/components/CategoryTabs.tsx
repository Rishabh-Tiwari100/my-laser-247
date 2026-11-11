import { LucideIcon } from 'lucide-react';
import React from 'react';
import { categoryIconMap } from '../constant';
import { referenceCategoryIcons } from '../referenceCategoryIcons';
import { cn, formatLabel } from '@/utils';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (label: string) => void;
  className?: string;
}

function categoryIcon(label: string) {
  const key = label.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const aliases: Record<string, string> = {
    ALL: 'OTHERS',
    SLOTGAMES: 'SLOTS',
    SLOTGAME: 'SLOTS',
    GAMESHOWS: 'LIVEGAMESHOW',
    LIVEGAMESHOWS: 'LIVEGAMESHOW',
    VIRTUALS: 'VIRTUAL',
    CARDGAMES: 'CARD',
    CRASHGAME: 'CRASH',
  };
  const reference =
    referenceCategoryIcons[aliases[key] ?? key] ??
    (key.startsWith('LIVE') ? referenceCategoryIcons[key.slice(4)] : undefined);
  return reference ?? categoryIconMap[label] ?? '/images/casino/category/three-cards.svg';
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  className,
}) => {
  const dragState = React.useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  return (
    <div className={`min-w-0 max-w-full ${className ?? ''}`}>
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
        className="min-w-0 max-w-full cursor-grab select-none overflow-x-scroll overflow-y-hidden overscroll-x-contain border border-[#aaa] bg-white [scrollbar-width:auto] [&::-webkit-scrollbar]:h-[14px] [&::-webkit-scrollbar-track]:bg-[#f5f5f5] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-[#f5f5f5] [&::-webkit-scrollbar-thumb]:bg-[#8c8c8c] active:cursor-grabbing"
      >
        <ul aria-label="Casino categories" className="flex w-max min-w-full flex-nowrap">
          {categories.map((label, index) => (
            <li
              key={index}
              role="button"
              tabIndex={0}
              aria-pressed={selectedCategory === label}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedCategory(label);
                }
              }}
              onClick={() => {
                if (dragState.current.isDragging) return;
                setSelectedCategory(label);
              }}
              className={cn(
                'flex h-[61px] min-w-[65px] shrink-0 cursor-pointer flex-col items-center justify-center gap-[3px] border-r border-[#aaa] px-[6px] py-[5px] text-[13px] font-normal uppercase leading-[20px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300',
                selectedCategory === label ? 'bg-[#243a48] text-white' : 'bg-white text-black'
              )}
            >
              <img
                src={categoryIcon(label)}
                alt=""
                className={cn(
                  'h-[30px] w-[30px] object-contain brightness-0',
                  selectedCategory === label && 'invert'
                )}
              />
              <span className="whitespace-nowrap">{formatLabel(label)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTabs;
