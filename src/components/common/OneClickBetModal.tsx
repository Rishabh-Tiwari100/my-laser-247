import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/hooks';
import { RootState } from '@/store';
import {
  useGetOneClickBettingQuery,
  useSaveOneClickBettingMutation,
} from '@/store/api/oneClickBettingApi';
import { setOneClickBetStake } from '@/store/slices/betSlice';

interface OneClickBetModalProps {
  onCancel: () => void;
  onSaved: () => void;
}

const DEFAULT_CLICK_BETS = [100, 500, 1000];

export default function OneClickBetModal({ onCancel, onSaved }: OneClickBetModalProps) {
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.profile?.id);
  const savedStake = useSelector((state: RootState) => state.betPlace.oneClickBetStake);
  const [values, setValues] = useState(DEFAULT_CLICK_BETS.map(String));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, isFetching } = useGetOneClickBettingQuery(userId ?? '', { skip: !userId });
  const [saveOneClickBetting, { isLoading }] = useSaveOneClickBettingMutation();

  const config = data?.data ?? data;
  const savedApiStake = useMemo(() => {
    const firstFieldValue = Number(config?.firstField);

    return Number.isFinite(firstFieldValue) && firstFieldValue > 0 ? firstFieldValue : null;
  }, [config]);

  const selectedStake = Number(values[selectedIndex]);
  const isSelectedStakeValid = Number.isFinite(selectedStake) && selectedStake > 0;
  const areValuesValid = values.every((value) => {
    const numericValue = Number(value);

    return value !== '' && Number.isFinite(numericValue) && numericValue > 0;
  });
  useEffect(() => {
    const nextValues = [config?.firstField, config?.secondField, config?.thirdField].map(
      (value, index) => String(value ?? DEFAULT_CLICK_BETS[index] ?? '')
    );
    const nextSavedStake = savedStake ?? savedApiStake ?? Number(nextValues[0]);
    const nextSelectedIndex = nextValues.findIndex((value) => Number(value) === nextSavedStake);

    setValues(nextValues);
    setSelectedIndex(nextSelectedIndex >= 0 ? nextSelectedIndex : 0);

    if (!savedStake && savedApiStake) {
      dispatch(setOneClickBetStake(savedApiStake));
    }
  }, [config, dispatch, savedApiStake, savedStake]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onCancel]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!areValuesValid || !isSelectedStakeValid) {
      toast.error('Please enter valid one click bet stake values.');
      return;
    }

    if (!userId) {
      toast.error('Unable to save click bet value. Please try again.');
      return;
    }

    try {
      const numericValues = values.map((value) => Number(value));
      const reorderedStakes = [
        selectedStake,
        ...numericValues.filter((stake, index) => index !== selectedIndex),
      ];

      const response = await saveOneClickBetting({
        oneClickId: config?.id ?? '',
        firstField: reorderedStakes[0] ?? selectedStake,
        secondField: reorderedStakes[1] ?? selectedStake,
        thirdField: reorderedStakes[2] ?? selectedStake,
      }).unwrap();

      dispatch(setOneClickBetStake(selectedStake));
      toast.success(response?.message || 'Click bet value saved.');
      onSaved();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save click bet value.');
    }
  };

  const handleValueChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setValues((currentValues) =>
      currentValues.map((currentValue, valueIndex) => (valueIndex === index ? value : currentValue))
    );
    setSelectedIndex(index);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[5000000000000002] flex items-center justify-center bg-black/50 px-2"
      data-one-click-bet-modal
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className="w-[498px] max-w-full translate-y-[28px] overflow-hidden rounded-[4px] bg-white shadow-[0_3px_10px_rgba(0,0,0,0.4)] sm:translate-x-[8px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="one-click-bet-modal-title"
      >
        <header className="flex h-[41px] items-center bg-[#243a48] px-[10px] text-white">
          <h2 id="one-click-bet-modal-title" className="text-[15px] font-bold">
            Click Bet Value
          </h2>
        </header>

        <form className="px-[8px] pb-[8px] pt-[11px] text-[#111]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-[6px]">
            {values.map((stake, index) => {
              const isSelected = selectedIndex === index;

              return (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  aria-label={`Click bet value ${index + 1}`}
                  aria-pressed={isSelected}
                  value={stake}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => setSelectedIndex(index)}
                  onChange={(event) => handleValueChange(index, event.target.value)}
                  disabled={isFetching || isLoading}
                  className={`h-[34px] min-w-0 rounded-[4px] border px-1 text-center text-[14px] font-bold outline-none transition-colors ${
                    isSelected
                      ? 'border-[#8d6500] bg-[#ffc93b] text-[#111]'
                      : 'border-[#9b9b9b] bg-white text-[#111] hover:bg-[#f3f5f6]'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                />
              );
            })}
          </div>

          <div className="mt-[13px] flex gap-[5px]">
            <button
              type="button"
              onClick={onCancel}
              className="h-[32px] flex-1 rounded-[3px] border border-[#243a48] bg-white text-[14px] text-[#243a48] hover:bg-[#f3f5f6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFetching || isLoading}
              className="h-[32px] flex-1 rounded-[3px] border border-[#aab2b8] bg-[#243a48] text-[14px] text-white hover:bg-[#1d2f3a] disabled:cursor-not-allowed disabled:bg-[#adb5bd] disabled:hover:bg-[#adb5bd]"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}
