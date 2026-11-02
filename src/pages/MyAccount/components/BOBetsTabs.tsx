type Props = {
  activeTab: 'history' | 'pl';
  onChange: (tab: 'history' | 'pl') => void;
};

export default function BOBetsTabs({ activeTab, onChange }: Props) {
  return (
    <div className="mb-4 flex">
      <button
        onClick={() => onChange('history')}
        className={`h-[28px] min-w-[150px] border border-[#5e7384] text-[13px] font-bold rounded-l-[3px]
        ${activeTab === 'history' ? 'bg-[#41586b] text-white' : 'bg-white text-[#29455d]'}`}
      >
        BO Bets
      </button>

      <button
        onClick={() => onChange('pl')}
        className={`-ml-px h-[28px] min-w-[145px] border border-[#5e7384] text-[13px] font-bold rounded-r-[3px]
        ${activeTab === 'pl' ? 'bg-[#41586b] text-white' : 'bg-white text-[#29455d]'}`}
      >
        Profit & Loss
      </button>
    </div>
  );
}
