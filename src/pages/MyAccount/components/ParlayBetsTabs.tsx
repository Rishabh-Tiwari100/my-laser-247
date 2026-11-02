type Props = {
  activeTab: 'history' | 'pl';
  onChange: (tab: 'history' | 'pl') => void;
};

export default function ParlayBetsTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-4 flex">
      <button
        onClick={() => onChange('history')}
        className={`h-[28px] px-4 border border-[#5d7385] rounded-l-[3px] text-[13px] font-bold ${
          activeTab === 'history' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'
        }`}
      >
        Parlay Bets History
      </button>

      <button
        onClick={() => onChange('pl')}
        className={`-ml-px h-[28px] px-4 border border-[#5d7385] rounded-r-[3px] text-[13px] font-bold ${
          activeTab === 'pl' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'
        }`}
      >
        Parlay Profit &amp; Loss
      </button>
    </div>
  );
}
