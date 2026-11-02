interface WithdrawHeaderProps {
  onBack: () => void;
  onAddAccount: () => void;
}

function WithdrawHeader({ onBack, onAddAccount }: WithdrawHeaderProps) {
  return (
    <div className="mb-[8px] flex min-h-[38px] items-center justify-between border-b border-dashed border-[#6f7880] px-[7px] pb-[9px]">
      <button
        type="button"
        onClick={onBack}
        className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
      >
        &lsaquo; BACK
      </button>
      <button
        type="button"
        onClick={onAddAccount}
        className="flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
      >
        ADD ACCOUNT
      </button>
    </div>
  );
}

export default WithdrawHeader;
