type Props = {
  activeTab: 'history' | 'pl';
  onChange: (tab: 'history' | 'pl') => void;
};

export default function BetgamesTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-[18px] flex">
      <button
        onClick={() => onChange('history')}
        className={`
          h-[28px]
          px-[14px]
          border
          border-[#607285]
          text-[13px]
          font-bold
          rounded-l-[3px]
          transition-none
          ${activeTab === 'history' ? 'bg-[#476075] text-white' : 'bg-white text-[#2d4860]'}
        `}
      >
        Betgames Bets History
      </button>

      <button
        onClick={() => onChange('pl')}
        className={`
          -ml-px
          h-[28px]
          px-[14px]
          border
          border-[#607285]
          text-[13px]
          font-bold
          rounded-r-[3px]
          transition-none
          ${activeTab === 'pl' ? 'bg-[#476075] text-white' : 'bg-white text-[#2d4860]'}
        `}
      >
        Betgames Profit & Loss
      </button>
    </div>
  );
}
