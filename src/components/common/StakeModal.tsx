import { StakeItem, useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { mdiClose, mdiCog } from '@mdi/js';

interface Props {
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
  mobileProfile?: boolean;
}

const defaultStakes = ['100', '200', '500', '1000', '2000', '5000', '10000', '25000'];

export default function StakeModal({ onClose, onSaved, mobileProfile = false }: Props) {
  const [stakes, setStakes] = useState(defaultStakes);
  const { data } = useGetStakeSetQuery({ type: 'Bet' });
  const [updateStakeSet, { isLoading }] = useUpdateStakeSetMutation();

  useEffect(() => {
    if (data?.stakeSet?.length) {
      setStakes(data.stakeSet.map((item) => String(item.value)));
    }
  }, [data]);

  const updateStake = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setStakes((currentStakes) =>
      currentStakes.map((stake, stakeIndex) => (stakeIndex === index ? value : stake))
    );
  };

  const handleSave = async () => {
    if (
      stakes.some((stake) => !stake || !Number.isSafeInteger(Number(stake)) || Number(stake) <= 0)
    ) {
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

  if (mobileProfile)
    return (
      <Dialog.Root
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[5000000000000002] bg-[#263746]/45" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-x-0 top-0 z-[5000000000000003] w-full bg-[#eee] font-helvetica text-black shadow-md focus:outline-none"
          >
            <header className="flex h-[50px] items-center justify-between bg-[#ffbf10] px-[12px] text-white">
              <Dialog.Title className="flex items-center gap-[6px] text-[14px] font-normal">
                <svg viewBox="0 0 24 24" className="size-[15px] fill-current" aria-hidden="true">
                  <path d={mdiCog} />
                </svg>
                Setting
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close stake settings"
                className="flex size-[28px] items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="size-[20px] fill-current" aria-hidden="true">
                  <path d={mdiClose} />
                </svg>
              </Dialog.Close>
            </header>
            <h2 className="bg-[#212121] px-[7px] text-[14px] font-normal leading-[32px] text-white">
              Stake
            </h2>
            <form
              className="p-[6px]"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSave();
              }}
            >
              <div className="grid grid-cols-4 gap-[4px]">
                {stakes.map((stake, index) => (
                  <input
                    key={index}
                    inputMode="numeric"
                    aria-label={`Stake ${index + 1}`}
                    value={stake}
                    onChange={(event) => updateStake(index, event.target.value)}
                    className="h-[28px] min-w-0 rounded-[3px] bg-[#ffbf10] px-1 text-center text-[13px] text-black outline-none focus:ring-2 focus:ring-[#243a48]"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-[5px] h-[40px] w-full rounded-[3px] border border-[#777] bg-[#212121] text-[16px] text-white disabled:opacity-60"
              >
                {isLoading ? 'Saving…' : 'Save'}
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[5000000000000002] bg-black/50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[8px] z-[5000000000000003] max-h-[calc(100dvh-16px)] w-[calc(100%_-_16px)] max-w-[500px] -translate-x-1/2 overflow-y-auto rounded-[4.8px] border border-black/20 bg-[#eee] font-helvetica text-black focus:outline-none sm:top-[28px] sm:max-h-[calc(100dvh-56px)]"
        >
          <header className="flex items-center justify-between bg-[#212121] px-[1.86667vw] text-[15px] leading-[33px] text-white lg:bg-[#243a48] lg:px-[10px] lg:py-[10px] lg:text-[18px] lg:leading-[10px]">
            <Dialog.Title className="m-0 text-inherit font-medium leading-[inherit]">
              Stake
            </Dialog.Title>
            <Dialog.Close
              type="button"
              aria-label="Close stake settings"
              className="flex h-[22.5px] w-[22.5px] items-center justify-center rounded-[4px] bg-transparent p-[3.75px] text-[15px] font-normal leading-none text-white opacity-50 hover:opacity-75 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white lg:h-[27px] lg:w-[27px] lg:p-[4.5px] lg:text-[18px]"
            >
              X
            </Dialog.Close>
          </header>

          <form
            className="grid grid-cols-4 border-b border-[#e0e6e6] p-[5px] shadow-[inset_0_-3px_2px_0_rgb(0_0_0_/_50%)] lg:grid-cols-[repeat(3,33%)]"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            {stakes.slice(0, 8).map((stake, index) => (
              <div key={index} className="min-w-0 p-[2px]">
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={`Stake ${index + 1}`}
                  value={stake}
                  onChange={(event) => updateStake(index, event.target.value)}
                  className="block h-[28px] w-full min-w-0 rounded-[3px] border border-[#ffbf19] bg-[#ffbf19] p-[5px] text-center text-[14px] font-normal leading-[normal] text-black outline-none focus-visible:ring-1 focus-visible:ring-[#243a48] lg:h-[27.5px] lg:rounded-[5px] lg:border-0 lg:bg-[#444] lg:px-0 lg:py-[4px] lg:text-[13px] lg:leading-[19.5px] lg:text-[#ffbf19] lg:shadow-[inset_0_0.53333vw_0_0_rgb(0_0_0_/_10%)]"
                />
              </div>
            ))}
            <div className="col-span-4 min-w-0 p-[2px] lg:col-span-1">
              <button
                type="submit"
                disabled={isLoading}
                className="block w-full rounded-[4px] border border-black bg-[#212121] p-[8px] text-center text-[16px] font-normal leading-[24px] text-white shadow-[inset_0_1px_0_0_rgb(255_255_255_/_80%)] disabled:cursor-not-allowed disabled:opacity-70 lg:rounded-[10px] lg:bg-[#e3e3e3] lg:p-[2px] lg:text-black"
              >
                {isLoading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
