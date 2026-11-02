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
  duration?: number;
  pauseOnHover?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({
  icon: Icon = FiMic,
  tagName = 'NEWS',
  className,
  contentClassName,
  duration = 20,
  pauseOnHover = false,
}) => {

  const isAuthenticated = useIsAuthenticated();
  const { data } = useGetNotificationsQuery(undefined, { skip: !isAuthenticated });
  const aletNotifications = data?.data?.Alert ?? [];
  const items = aletNotifications?.map(item => item?.body ?? "");


  return (
    <div
      className={cn(
        'flex items-center h-[26px] overflow-hidden bg-[linear-gradient(180deg,#2a3a43_27%,#1c282d_83%)] leading-[26px]',
        className
      )}
    >
      {/* Fixed Tag */}
      <div className="text-white relative shrink-0 h-full p-[4px_25px_4px_4px] flex items-center after:content-[''] after:absolute after:right-0 after:top-0 after:h-[30px] after:w-[12px] after:bg-[url('/icons/right-icon.png')] after:bg-contain after:bg-no-repeat">
        <Icon className="text-sm mr-[2px]" />
        <span>{tagName}</span>
      </div>

      {/* Marquee */}
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div
          className={cn(
            'inline-block min-w-max animate-marquee',
            pauseOnHover && 'hover:[animation-play-state:paused]',
            contentClassName
          )}
          style={{
            animationDuration: `${duration}s`,
          }}
        >
          {items.map((item, index) => (
            <span key={index} className="inline-flex items-center px-4 text-[red] text-base">
              {item}
              {index !== items.length - 1 && <span className="ml-4">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
