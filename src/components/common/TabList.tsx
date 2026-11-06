import React from 'react';

interface Match {
  id: number | string;
  name: string;
}

interface TabListProps {
  list: Match[];
  selected: number | string;
  onSelect: (id: number | string, name: string) => void;
  className?: string;
}

const TabList: React.FC<TabListProps> = ({ list, selected, onSelect, className }) => {
  const dragState = React.useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleSelect = (id: number | string, name: string) => {
    if (dragState.current.isDragging) return;
    onSelect(id, name);
  };

  return (
    <ul
      aria-label="Casino providers"
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
      className={`flex w-full min-w-0 max-w-full cursor-grab select-none flex-nowrap overflow-x-scroll overflow-y-hidden overscroll-x-contain whitespace-nowrap border-b border-[#aaa] bg-white [scrollbar-width:auto] [&::-webkit-scrollbar]:h-[14px] [&::-webkit-scrollbar-track]:bg-[#f5f5f5] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-[#f5f5f5] [&::-webkit-scrollbar-thumb]:bg-[#8c8c8c] active:cursor-grabbing ${className ?? ''}`}
    >
      {list.map((item) => (
        <li
          key={item?.id}
          onClick={() => handleSelect(item.id, item.name)}
          className="shrink-0 cursor-pointer border border-[#aaa] bg-[#243a48]"
        >
          <button
            type="button"
            aria-pressed={item?.id == selected || item?.name == selected}
            className={`flex h-[36px] items-center gap-[4px] px-[17px] py-[6px] text-[13px] font-normal leading-[20px] ${item?.id == selected || item?.name == selected ? 'bg-white text-[#243a48]' : 'bg-[#243a48] text-white'}`}
          >
            <span className="shrink-0">{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabList;
