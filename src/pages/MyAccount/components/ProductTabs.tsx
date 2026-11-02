type Product = 'all' | 'exchange' | 'fancy' | 'bookmaker' | 'sportsbook' | 'binary';

type Props = {
  active: Product;
  onChange: (tab: Product) => void;
};

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'exchange', label: 'Exchange' },
  { key: 'fancy', label: 'Fancybet' },
  { key: 'bookmaker', label: 'Bookmaker' },
  { key: 'sportsbook', label: 'Sportsbook' },
  { key: 'binary', label: 'Binary' },
] as const;

export default function ProductTabs({ active, onChange }: Props) {
  return (
    <div className="mb-3 border-b-[4px] border-[#435a6d]">
      <div className="flex items-end">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`h-[28px] min-w-[98px] border border-[#5d7385] text-[13px] font-bold ${
              tab.key === 'all' ? 'min-w-[72px]' : '-ml-px'
            } ${active === tab.key ? 'bg-[#435a6d] text-white' : 'bg-white text-[#2d4860]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
