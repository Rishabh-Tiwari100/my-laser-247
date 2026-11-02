type Props = {
  activeTab: 'history' | 'pl';
  onChange: (tab: 'history' | 'pl') => void;
};

export default function AWCBetsTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-4 flex">
      <button
        onClick={() => onChange('history')}
        className={`h-[28px] px-4 border border-[#5d7385] text-[13px] font-bold rounded-l-[3px]
        ${activeTab === 'history' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'}`}
      >
        AWC Bets History
      </button>

      <button
        onClick={() => onChange('pl')}
        className={`-ml-px h-[28px] px-4 border border-[#5d7385] text-[13px] font-bold rounded-r-[3px]
        ${activeTab === 'pl' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'}`}
      >
        AWC Profit &amp; Loss
      </button>
    </div>
  );
}
