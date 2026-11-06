import { useEffect, useState } from 'react';
import { useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import toast from 'react-hot-toast';

const defaults = ['100', '200', '500', '1000', '2000', '5000', '10000', '25000'];

export default function StakeSettingsPanel() {
  const { data } = useGetStakeSetQuery({ type: 'Bet' });
  const [values, setValues] = useState(defaults);
  const [save, { isLoading }] = useUpdateStakeSetMutation();
  useEffect(() => {
    if (data?.stakeSet?.length) setValues(data.stakeSet.map((item) => String(item.value)));
  }, [data]);
  return (
    <section id="sidebar-stake-settings" aria-label="Stake settings" className="shrink-0 border-b-2 border-[#888] bg-[#eee]">
      <h2 className="bg-[#243a48] px-[10px] text-[20px] font-normal leading-[30px] text-white">Stake</h2>
      <form className="grid grid-cols-3 gap-[4px] p-[7px]" onSubmit={async (event) => {
        event.preventDefault();
        if (values.some((value) => !value || Number(value) <= 0 || !Number.isSafeInteger(Number(value)))) {
          toast.error('Enter a positive whole number for each stake');
          return;
        }
        try {
          await save({ type: 'Bet', data: values.map((value, index) => ({ label: data?.stakeSet?.[index]?.label ?? String(index + 1), value: Number(value) })) }).unwrap();
          toast.success('Stake values saved');
        } catch { toast.error('Failed to save stake values'); }
      }}>
        {values.map((value, index) => <input key={index} aria-label={`Stake ${index + 1}`} inputMode="numeric" value={value} onChange={(event) => {
          if (/^\d*$/.test(event.target.value)) setValues((current) => current.map((item, i) => i === index ? event.target.value : item));
        }} className="h-[28px] min-w-0 rounded-[5px] bg-[#444] px-1 text-center text-[13px] text-[#ffdc00] outline-none focus:ring-2 focus:ring-[#00c5ee]" />)}
        <button disabled={isLoading} type="submit" className="h-[30px] rounded-[10px] border border-black bg-[#e4e4e4] text-[16px] text-black disabled:opacity-60">{isLoading ? 'Saving…' : 'Save'}</button>
      </form>
    </section>
  );
}
