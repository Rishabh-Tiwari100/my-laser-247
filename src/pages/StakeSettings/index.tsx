import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '@/utils/icons';
import { StakeFormValues, stakeSchema } from '@/utils/validations';
import { useGetStakeSetQuery, useUpdateStakeSetMutation } from '@/store/api/stakesApi';
import toast from 'react-hot-toast';
import LoaderTwo from '@/components/common/LoaderTwo';
import { useNavigate } from 'react-router-dom';

const presetValues = ['100', '200', '300', '500', '700', '1000', '1500', '2000'];

const StakeSettings = () => {
  const { data: stakes, isLoading: stakesLoader } = useGetStakeSetQuery({ type: 'string' });
  const stakesArr = stakes?.stakeSet ?? [];
  const [updateStakeSet, { isLoading: isUpdatingStakes }] = useUpdateStakeSetMutation();
  const navigate = useNavigate();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StakeFormValues>({
    resolver: zodResolver(stakeSchema),
    defaultValues: { stakes: [] },
  });

  const { fields } = useFieldArray({
    control,
    name: 'stakes',
  });

  useEffect(() => {
    if (stakesArr.length > 0) {
      reset({ stakes: stakesArr });
    }
  }, [stakesArr, reset]);

  const handleValueChange = (index: number, increment: boolean) => {
    const current = watch(`stakes.${index}.value`);
    const newValue = increment ? current + 1 : Math.max(current - 1, 0);
    setValue(`stakes.${index}.value`, newValue, { shouldValidate: true });
  };

  const selectedValue = useMemo(() => {
    if (!fields.length) return '';
    return String(watch('stakes.0.value') ?? stakesArr[0]?.value ?? '');
  }, [fields.length, stakesArr, watch]);

  const handlePresetClick = (value: string) => {
    if (!fields.length) return;
    setValue(`stakes.0.value`, Number(value), { shouldValidate: true });
  };

  const onSubmit = async (data: StakeFormValues) => {
    const toastId = { id: 'stake-setting' };

    try {
      const res = await updateStakeSet({
        data: data.stakes,
        type: 'Bet',
      }).unwrap();

      toast.success(res.message, toastId);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update stake set', toastId);
    }
  };

  if (stakesLoader) return <LoaderTwo text="Loading Stakes..." className="justify-center my-10" />;
  if (stakesArr.length === 0)
    return <div className="w-full my-10 text-center text-lg">No Stakes Available.</div>;

  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded bg-black px-3 py-2 text-white text-sm mb-4 sm:hidden"
      >
        <Icons.angularLeftArrow className="h-4 w-4" />
        Back
      </button>

      <div className="max-w-[1080px] mx-auto space-y-6">
        <section className="rounded-3xl border border-[#1f2937] bg-[#06152d] p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#10254f] px-3 py-1 text-sm font-semibold text-white/90">
                <Icons.stakeSettings className="h-4 w-4" />
                Stake Settings
              </div>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Update your stake quick buttons and default stake values. Click a preset to set the
                current stake, edit labels, then save.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdatingStakes || stakesArr.length === 0}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-50"
            >
              {isUpdatingStakes ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="mt-6 rounded-3xl bg-[#0b1f3c] p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {presetValues.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePresetClick(value)}
                  className={`rounded-2xl border px-4 py-3 text-center text-sm font-bold transition
                    ${
                      String(selectedValue) === value
                        ? 'border-cyan-300 bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] text-slate-950'
                        : 'border-slate-600 bg-slate-900 text-slate-200 hover:border-cyan-300 hover:bg-slate-800'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-3xl border border-slate-800 bg-[#081426] p-5 shadow-lg shadow-slate-950/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-200">
                  Stake Button #{index + 1}
                </span>
                <span className="rounded-full bg-slate-700 px-2 py-1 text-xs uppercase tracking-[0.12em] text-slate-300">
                  Value: {field.value}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                    Button Label
                  </label>
                  <Controller
                    name={`stakes.${index}.label`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                          placeholder="Enter label"
                        />
                        {error && <p className="mt-2 text-xs text-rose-400">{error.message}</p>}
                      </>
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-400">
                    Stake Value
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleValueChange(index, false)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-white transition hover:bg-slate-700"
                    >
                      -
                    </button>
                    <Controller
                      name={`stakes.${index}.value`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!/^\d*$/.test(val)) return;
                              field.onChange(Number(val || 0));
                            }}
                            className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-center text-sm text-white outline-none placeholder:text-slate-500"
                          />
                          {error && <p className="mt-2 text-xs text-rose-400">{error.message}</p>}
                        </>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => handleValueChange(index, true)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-white transition hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default StakeSettings;
