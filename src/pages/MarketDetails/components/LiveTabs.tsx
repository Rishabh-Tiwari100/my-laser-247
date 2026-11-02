import { useIsDemoUser } from '@/hooks/redux';
import { cn } from '@/utils';
import { Icons } from '@/utils/icons';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { VscTriangleDown } from 'react-icons/vsc';

interface LiveTabsProps {
  liveTvUrl?: string | null;
  liveScoreUrl?: string | null;
  className?: string;
}

function LiveTabs({ liveTvUrl, liveScoreUrl, className }: LiveTabsProps) {
  const [tab, setTab] = useState<'ODDS' | 'LIVE_TV' | 'LIVE_SCORE'>('ODDS');
  const isDemoUser = useIsDemoUser();

  const tabButtonClass = (active: boolean) =>
    `flex-1 py-1.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 border-r border-primary-dark transition ${
      active ? 'bg-primary/80 text-white' : 'bg-primary-dark2 hover:bg-primary-dark'
    }`;

  const [iframeHeight, setIframeHeight] = useState(142);
  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     setIframeHeight(event?.data?.scoreWidgetHeight);
  //   };

  //   window.addEventListener('message', handleMessage);

  //   return () => {
  //     window.removeEventListener('message', handleMessage);
  //   };
  // }, []);

  const handleSetIframeHeight = useCallback(() => {
    // const height=width<
    setIframeHeight((prev) => {
      if (prev === 142) return 300;
      return 142;
    });
  }, []);

  return (
    <div className={cn('w-full border border-primary mb-2 rounded overflow-hidden', className)}>
      {/* Tabs */}
      <div className="flex w-full text-center bg-primary text-white">
        <button className={tabButtonClass(tab === 'ODDS')} onClick={() => setTab('ODDS')}>
          ODDS
        </button>

        <button
          className={tabButtonClass(tab === 'LIVE_SCORE')}
          onClick={() => setTab('LIVE_SCORE')}
        >
          <Icons.chart className="w-4 h-4" />
        </button>

        <button
          className={tabButtonClass(tab === 'LIVE_TV')}
          onClick={() => {
            if (isDemoUser)
              toast.error('Sorry for inconvenience, use real ID to watch streaming..', {
                id: 'live-tv',
              });
            else setTab('LIVE_TV');
          }}
        >
          <Icons.tv className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      {tab !== 'ODDS' && (
        <div className="bg-black w-full flex items-center justify-center p-1">
          {tab === 'LIVE_TV' &&
            (liveTvUrl ? (
              <iframe
                src={liveTvUrl}
                title="Live TV"
                allow="autoplay; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-popups"
                className="w-full aspect-video rounded-md"
              />
            ) : (
              <p className="text-white text-15 py-2">Live stream unavailable</p>
            ))}

          {tab === 'LIVE_SCORE' &&
            (liveScoreUrl ? (
              <div
                className="w-full relative bg-[#322f32] touch-manipulation block overflow-hidden"
                style={{ height: `${iframeHeight}px`, transition: 'height 300ms ease' }}
              >
                <iframe
                  src={liveScoreUrl}
                  title="Live Scorecard"
                  className="!w-full"
                  scrolling="hidden"
                  style={{ display: 'block', height: '100%', overflow: 'hidden' }}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>
                <div className="bg-[#322f32] w-full absolute bottom-0 flex justify-center">
                  <button onClick={handleSetIframeHeight}>
                    <VscTriangleDown className="text-white text-lg" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white text-15 py-2">Live score unavailable</p>
            ))}
        </div>
      )}
    </div>
  );
}

export default LiveTabs;
