import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaRegCalendarAlt } from 'react-icons/fa';
import CalendarPopup from './CalendarPopup';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export default function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();

      setPosition({
        left: rect.left,
        top: rect.bottom + 4,
      });
    }

    setOpen((prev) => !prev);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        readOnly
        value={format(value, 'dd-MM-yyyy')}
        className="h-[24px] w-[110px] rounded border border-[#bbb] bg-white px-2 pr-7 text-[13px]"
      />

      <button
        type="button"
        onClick={handleOpen}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <FaRegCalendarAlt size={13} className="text-[#666]" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999]"
            style={{
              left: position.left,
              top: position.top,
            }}
          >
            <CalendarPopup value={value} onChange={onChange} onClose={() => setOpen(false)} />
          </div>,
          document.body
        )}
    </div>
  );
}
