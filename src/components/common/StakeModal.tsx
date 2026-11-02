import { StakeItem, useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
}

const defaultStakes = ['100', '200', '300', '500', '700', '1000', '1500', '2000'];

export default function StakeModal({ onClose, onSaved }: Props) {
  const [stakes, setStakes] = useState(defaultStakes);
  const { data } = useGetStakeSetQuery({ type: 'Bet' });
  const [updateStakeSet, { isLoading }] = useUpdateStakeSetMutation();

  useEffect(() => {
    if (data?.stakeSet?.length) {
      setStakes(data.stakeSet.map((item) => String(item.value)));
    }
  }, [data]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const updateStake = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setStakes((currentStakes) =>
      currentStakes.map((stake, stakeIndex) => (stakeIndex === index ? value : stake))
    );
  };

  const handleSave = async () => {
    const payload: StakeItem[] = stakes.map((stake, index) => ({
      label: data?.stakeSet?.[index]?.label ?? `${index + 1}`,
      value: Number(stake) || 0,
    }));

    try {
      await updateStakeSet({ data: payload, type: 'Bet' }).unwrap();
      await onSaved?.();
      toast.success('Stake values saved');
      onClose();
    } catch {
      toast.error('Failed to save stake values');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[5000000000000001] flex items-start justify-center bg-black/50 pt-[3px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-[500px] max-w-[calc(100%-16px)] overflow-hidden rounded-b-[6px] bg-[#f5f5f5] shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stake-modal-title"
      >
        <header className="flex items-center bg-[#243a48] px-[10px] py-[13px] text-white">
          <h2 id="stake-modal-title" className="text-[15px] flex-1 items-center px-8">
            Stake
          </h2>
          <button
            type="button"
            aria-label="Close stake settings"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-[27px] font-light leading-none text-[#e7edf1] hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="p-[10px]">
          <div className="grid grid-cols-4 gap-[5px]">
            {stakes.slice(0, 8).map((stake, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                aria-label={`Stake ${index + 1}`}
                value={stake}
                onChange={(event) => updateStake(index, event.target.value)}
                className="h-[26px] min-w-0 rounded-[2px] bg-[#263f50] px-1 text-center text-[14px] text-white outline-none focus:ring-2 focus:ring-[#12bce6]"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="mt-[5px] h-[37px] w-full rounded-[2px] bg-[#243a48] text-[16px] text-white hover:bg-[#8b8b8b] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>
    </div>
  );
}
