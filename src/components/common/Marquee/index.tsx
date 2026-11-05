import React from 'react';
import { IconType } from 'react-icons';
import { FiMic } from 'react-icons/fi';
import { cn } from '@/utils';
import './index.css';
import { useGetNotificationsQuery } from '@/store/api/notificationApi';
import { useIsAuthenticated } from '@/hooks';

interface MarqueeProps {
  icon?: IconType;
  tagName?: string;
  className?: string;
  contentClassName?: string;
  tagClassName?: string;
  duration?: number;
  pauseOnHover?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
  icon: Icon = FiMic,
  tagName = 'NEWS',
  className,
  contentClassName,
  tagClassName,
  duration = 30,
  pauseOnHover = true,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const { data } = useGetNotificationsQuery(undefined, { skip: !isAuthenticated });
  const alertNotifications = data?.data?.Alert ?? [];
  const items = alertNotifications.map((item) => item?.body ?? '').filter(Boolean);

  return (
    <div
      className={cn(
        'mb-px flex h-[26px] min-w-0 items-center overflow-hidden font-helvetica leading-[26px] text-white [background:var(--commentary,linear-gradient(180deg,#2a3a43_27%,#1c282d_83%))]',
        className
      )}
    >
      {/* Fixed Tag */}
      <h4 className={cn("relative z-[1] m-0 flex h-full shrink-0 items-center p-[4px_15px_4px_4px] text-xs font-normal text-white [background:var(--commentary,linear-gradient(180deg,#2a3a43_27%,#1c282d_83%))] after:absolute after:right-0 after:top-0 after:h-[26px] after:w-[11px] after:bg-[url('/icons/right-icon.png')] after:bg-contain after:bg-no-repeat after:content-['']", tagClassName)}>
        <Icon className="mr-[2px] shrink-0 text-[20px]" aria-hidden="true" />
        <span>{tagName}</span>
      </h4>

      {/* Marquee */}
      <div className="group min-w-0 flex-1 overflow-hidden whitespace-nowrap">
        <div
          className={cn(
            'news-marquee-track inline-block min-w-full whitespace-nowrap pl-[100%] text-xs font-bold text-[color:var(--marquee,#fff)]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            contentClassName
          )}
          style={{
            animationDuration: `${duration}s`,
          }}
        >
          {items.map((item, index) => (
            <span key={index} className="inline-flex items-center">
              {item}
              {index !== items.length - 1 && <span className="mx-4" aria-hidden="true">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
