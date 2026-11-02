import React from 'react';
import 'swiper/css';

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
      className={`scrollbar-hidden flex w-full min-w-0 max-w-full cursor-grab select-none flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-sm border-b border-[#dee2e6] overscroll-x-contain active:cursor-grabbing ${className ?? ''}`}
    >
      {list.map((item) => (
        <li
          key={item?.id}
          onClick={() => handleSelect(item.id, item.name)}
          className="mb-px shrink-0 bg-primary-theme border border-primary-theme cursor-pointer"
        >
          <button
            type="button"
            className={`flex items-center gap-1 text-[13px] pl-4 pr-8 py-2 border border-primary-theme ${item?.id == selected || item?.name == selected ? 'text-[#495057] bg-white' : 'bg-primary-theme text-white'}`}
          >
            {item?.name !== 'ALL' && (
              <span className="shrink-0">
                <img
                  src="/icons/provider.svg"
                  className={`w-auto max-w-full ${(item?.id == selected || item?.name == selected) && 'invert'}`}
                  alt=""
                />
              </span>
            )}
            <span className="shrink-0">{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabList;
