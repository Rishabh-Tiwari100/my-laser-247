import { Icons } from '@/utils/icons';
import { useClipboard } from '@/hooks';
import { FaCopy } from 'react-icons/fa';

interface AccountInfoRowProps {
  label: string;
  value: string;
  copyable?: boolean;
}

function AccountInfoRow({ label, value, copyable = true }: AccountInfoRowProps) {
  const { copy } = useClipboard();

  return (
    <div className="flex min-h-[39px] items-center justify-between gap-[10px] border-b border-[#e6e6e6] px-[12px] text-sm last:border-b-0">
      <span className="w-[135px] shrink-0 font-normal text-[#111] sm:w-[150px]">{label}</span>
      <span className="shrink-0 font-bold text-[#111]">:</span>
      <span className="mr-auto min-w-0 break-all font-bold text-[#000]">{value || '-'}</span>
      {copyable && value && (
        <button
          type="button"
          onClick={() => copy(value, label)}
          aria-label={`Copy ${label}`}
          className="shrink-0 text-[#243a48] hover:text-[#111]"
        >
          <FaCopy />
        </button>
      )}
    </div>
  );
}

export default AccountInfoRow;
