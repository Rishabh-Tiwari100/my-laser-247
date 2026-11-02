import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface MarketFilterSettings {
  showFullScreen: boolean;
  hideMatchOdds: boolean;
  hideBookmakers: boolean;
  hideFancyTabs: boolean;
  hideOtherMarket: boolean;
}

interface MarketFilterModalProps {
  open: boolean;
  settings: MarketFilterSettings;
  onApply: (settings: MarketFilterSettings) => void;
  onClear: () => void;
  onClose: () => void;
}

const checkboxClassName = 'h-[12px] w-[12px] accent-[#243a48]';

export const defaultMarketFilterSettings: MarketFilterSettings = {
  showFullScreen: false,
  hideMatchOdds: false,
  hideBookmakers: false,
  hideFancyTabs: false,
  hideOtherMarket: false,
};

export default function MarketFilterModal({
  open,
  settings,
  onApply,
  onClear,
  onClose,
}: MarketFilterModalProps) {
  const [draftSettings, setDraftSettings] = useState<MarketFilterSettings>(settings);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraftSettings(settings);
    closeButtonRef.current?.focus();
  }, [open, settings]);

  useEffect(() => {
    if (!open) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  const updateSetting = (key: keyof MarketFilterSettings, value: boolean) => {
    setDraftSettings((current) => ({ ...current, [key]: value }));
  };

  const handleClear = () => {
    setDraftSettings(defaultMarketFilterSettings);
    onClear();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[5000000000000002] flex items-start justify-center bg-black/50 px-3 pt-[36px] font-[Arial,Helvetica,sans-serif]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-[470px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[5px] bg-white text-[#050505] shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="market-filter-title"
      >
        <header className="flex h-[38px] items-center justify-between bg-[#243a48] px-[10px] text-white">
          <div className="flex items-center gap-[6px]">
            <h2 id="market-filter-title" className="m-0 text-[14px] font-bold">
              Hide/Show Filter
            </h2>
            <button
              type="button"
              className="rounded-[3px] bg-[#d5ebf6] px-[7px] py-[2px] text-[11px] font-semibold text-black"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="flex h-[24px] w-[22px] items-center justify-center border-0 bg-transparent p-0 text-white hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
            aria-label="Close filter"
            onClick={onClose}
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </header>

        <div className="px-[10px] pb-[9px] pt-[12px]">
          <h3 className="m-0 mb-[8px] text-[13px] font-bold">Hide/Show Check Below</h3>

          <div className="grid grid-cols-2 gap-x-[48px] gap-y-[7px] text-[12px] text-[#2b2b2b] max-[560px]:grid-cols-1">
            <label className="flex items-center gap-[6px]">
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={draftSettings.showFullScreen}
                onChange={(event) => updateSetting('showFullScreen', event.target.checked)}
              />
              <span>Show Full Screen</span>
            </label>
            <label className="flex items-center gap-[6px]">
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={draftSettings.hideMatchOdds}
                onChange={(event) => updateSetting('hideMatchOdds', event.target.checked)}
              />
              <span>Hide Match Odds</span>
            </label>
            <label className="flex items-center gap-[6px]">
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={draftSettings.hideBookmakers}
                onChange={(event) => updateSetting('hideBookmakers', event.target.checked)}
              />
              <span>Hide Bookmakers</span>
            </label>
            <label className="flex items-center gap-[6px]">
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={draftSettings.hideFancyTabs}
                onChange={(event) => updateSetting('hideFancyTabs', event.target.checked)}
              />
              <span>Hide Fancy Tabs</span>
            </label>
            <label className="flex items-center gap-[6px]">
              <input
                type="checkbox"
                className={checkboxClassName}
                checked={draftSettings.hideOtherMarket}
                onChange={(event) => updateSetting('hideOtherMarket', event.target.checked)}
              />
              <span>Hide Other Market</span>
            </label>
          </div>

          <button
            type="button"
            className="mt-[10px] flex h-[32px] w-full items-center justify-center rounded-[4px] bg-[#243a48] text-[13px] font-bold text-white hover:bg-[#172c38]"
            onClick={() => onApply(draftSettings)}
          >
            Apply
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
