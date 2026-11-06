import { StakeItem, useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { mdiCog } from '@mdi/js';

interface Props {
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
  mobileProfile?: boolean;
}

const defaultStakes = ['100', '200', '300', '500', '700', '1000', '1500', '2000'];

export default function StakeModal({ onClose, onSaved, mobileProfile = false }: Props) {
  const [stakes, setStakes] = useState(mobileProfile ? ['100', '200', '500', '1000', '2000', '5000', '10000', '25000'] : defaultStakes);
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
    if (stakes.some((stake) => !stake || !Number.isSafeInteger(Number(stake)) || Number(stake) <= 0)) {
      toast.error('Enter a positive whole number for each stake');
      return;
    }
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

  if (mobileProfile) return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[5000000000000002] bg-[#263746]/45" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-x-0 top-0 z-[5000000000000003] w-full bg-[#eee] font-helvetica text-black shadow-md focus:outline-none">
          <header className="flex h-[50px] items-center justify-between bg-[#ffbf10] px-[12px] text-white">
            <Dialog.Title className="flex items-center gap-[6px] text-[14px] font-normal"><svg viewBox="0 0 24 24" className="size-[15px] fill-current" aria-hidden="true"><path d={mdiCog} /></svg>Setting</Dialog.Title>
            <Dialog.Close aria-label="Close stake settings" className="flex size-[28px] items-center justify-center text-[23px] leading-none">×</Dialog.Close>
          </header>
          <h2 className="bg-[#212121] px-[7px] text-[14px] font-normal leading-[32px] text-white">Stake</h2>
          <form className="p-[6px]" onSubmit={(event) => { event.preventDefault(); void handleSave(); }}>
            <div className="grid grid-cols-4 gap-[4px]">
              {stakes.map((stake, index) => <input key={index} inputMode="numeric" aria-label={`Stake ${index + 1}`} value={stake} onChange={(event) => updateStake(index, event.target.value)} className="h-[28px] min-w-0 rounded-[3px] bg-[#ffbf10] px-1 text-center text-[13px] text-black outline-none focus:ring-2 focus:ring-[#243a48]" />)}
            </div>
            <button type="submit" disabled={isLoading} className="mt-[5px] h-[40px] w-full rounded-[3px] border border-[#777] bg-[#212121] text-[16px] text-white disabled:opacity-60">{isLoading ? 'Saving…' : 'Save'}</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

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
