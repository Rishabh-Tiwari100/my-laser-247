type Props = {
  activeTab: 'current' | 'history' | 'pl';
  onChange: (tab: 'current' | 'history' | 'pl') => void;
};

export default function MyBetsTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex mb-4">
      <button
        onClick={() => onChange('current')}
        className={`h-[28px] min-w-[148px] border border-[#5d7385] rounded-l-[3px] text-[13px] font-bold ${
          activeTab === 'current' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'
        }`}
      >
        Current Bets
      </button>

      <button
        onClick={() => onChange('history')}
        className={`-ml-px h-[28px] min-w-[148px] border border-[#5d7385] text-[13px] font-bold ${
          activeTab === 'history' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'
        }`}
      >
        Bets History
      </button>

      <button
        onClick={() => onChange('pl')}
        className={`-ml-px h-[28px] min-w-[148px] border border-[#5d7385] rounded-r-[3px] text-[13px] font-bold ${
          activeTab === 'pl' ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'
        }`}
      >
        Profit &amp; Loss
      </button>
    </div>
  );
}
