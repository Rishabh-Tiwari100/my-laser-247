import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface InfoTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  position?: TooltipPosition;
  className?: string;
}

interface TooltipCoordinates {
  top: number;
  left: number;
}

const TOOLTIP_GAP = 10;
const VIEWPORT_PADDING = 8;
const HOVER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)';

const arrowClassByPosition: Record<TooltipPosition, string> = {
  top: 'left-1/2 top-full -translate-x-1/2 -translate-y-1/2',
  right: 'right-full top-1/2 translate-x-1/2 -translate-y-1/2',
  bottom: 'left-1/2 bottom-full -translate-x-1/2 translate-y-1/2',
  left: 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2',
};

const getTooltipCoordinates = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition
): TooltipCoordinates => {
  switch (position) {
    case 'top':
      return {
        top: triggerRect.top - tooltipRect.height - TOOLTIP_GAP,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + TOOLTIP_GAP,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - TOOLTIP_GAP,
      };
    case 'bottom':
    default:
      return {
        top: triggerRect.bottom + TOOLTIP_GAP,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
  }
};

const clampCoordinates = (coordinates: TooltipCoordinates, tooltipRect: DOMRect) => ({
  top: Math.min(
    Math.max(coordinates.top, VIEWPORT_PADDING),
    window.innerHeight - tooltipRect.height - VIEWPORT_PADDING
  ),
  left: Math.min(
    Math.max(coordinates.left, VIEWPORT_PADDING),
    window.innerWidth - tooltipRect.width - VIEWPORT_PADDING
  ),
});

const getSupportsHover = () =>
  typeof window !== 'undefined' && window.matchMedia(HOVER_MEDIA_QUERY).matches;

function HoverTooltip({
  content,
  children,
  width = 'w-[240px]',
  position = 'bottom',
  className = '',
}: InfoTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates | null>(null);
  const [supportsHover, setSupportsHover] = useState(getSupportsHover);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const nextCoordinates = getTooltipCoordinates(triggerRect, tooltipRect, position);

    setCoordinates(clampCoordinates(nextCoordinates, tooltipRect));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia(HOVER_MEDIA_QUERY);
    const handleChange = () => setSupportsHover(mediaQuery.matches);

    handleChange();

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, position, content, width, supportsHover]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePositionUpdate = () => updatePosition();

    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate, true);

    return () => {
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate, true);
    };
  }, [isOpen, position, content, width, supportsHover]);

  useEffect(() => {
    if (supportsHover || !isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (triggerRef.current?.contains(target) || tooltipRef.current?.contains(target)) return;

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, supportsHover]);

  const tooltip =
    isOpen && typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'pointer-events-none fixed z-[1000] rounded-[4px] bg-[#333] px-[10px] py-[5px] text-center text-[11px] leading-5 text-white shadow-[0_8px_18px_rgba(0,0,0,0.28)]',
              width,
              coordinates ? 'visible opacity-100' : 'invisible opacity-0'
            )}
            style={{
              top: coordinates?.top ?? 0,
              left: coordinates?.left ?? 0,
            }}
            role="tooltip"
          >
            {content}
            <div
              className={cn(
                'absolute h-3 w-3 rotate-45 bg-[#333]',
                arrowClassByPosition[position]
              )}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={cn('inline-flex', className)}
        onMouseEnter={() => {
          if (supportsHover) {
            setIsOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (supportsHover) {
            setIsOpen(false);
          }
        }}
        onFocus={() => {
          if (supportsHover) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          if (supportsHover) {
            setIsOpen(false);
          }
        }}
        onClickCapture={() => {
          if (!supportsHover) {
            setIsOpen((previous) => !previous);
          }
        }}
      >
        {children}
      </span>
      {tooltip}
    </>
  );
}

export default HoverTooltip;
