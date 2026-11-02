// components/AmountInput.tsx
import React from 'react';
import { Control, Controller, useFormContext, FieldValues, Path } from 'react-hook-form';
interface AmountInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  min?: number;
  max?: number;
  quickAmounts?: number[];
  label?: string;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  className?: string;
}

function AmountInput<T extends FieldValues>({
  name,
  control,
  min = 100,
  max = 10000,
  quickAmounts = [500, 1000, 5000, 10000, 25000],
  label = 'Amount',
  placeholder = 'Enter Amount',
  icon = '/images/wallet-bank/taka.svg',
  required = true,
  className = '',
}: AmountInputProps<T>) {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<T>();

  const amount = watch(name) as string | undefined;
  const safeMin = Number.isFinite(Number(min)) ? Number(min) : 0;
  const safeMax = Number.isFinite(Number(max)) ? Number(max) : 0;

  const increaseAmount = async (value: number) => {
    const newAmount = String(Number(amount || 0) + value);
    setValue(name, newAmount as any);
    await trigger(name);
  };

  const decreaseAmount = async () => {
    const newAmount = String(Math.max(0, Number(amount || 0) - 50));
    setValue(name, newAmount as any);
    await trigger(name);
  };

  const error = errors[name];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Range Info */}
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {/* <p className="text-11 text-gray-600">
          The Withdraw amount must be between {min.toLocaleString()} (min) and{' '}
          {max.toLocaleString()} (max).
        </p> */}
        <p className="hidden sm:block text-11">
          The Withdraw amount must be between{' '}
          <span className="font-semibold text-gray-700">{safeMin}</span> (min) and{' '}
          <span className="font-semibold text-gray-700">{safeMax}</span> (max).
        </p>
        <p className="sm:hidden text-11">
          Withdraw between <span className="font-semibold text-gray-700">{safeMin}</span> and{' '}
          <span className="font-semibold text-gray-700">{safeMax}</span>
        </p>
      </div>

      {/* Input Field */}
      <div className="flex items-center border border-primary-light bg-white rounded-lg overflow-hidden">
        <span className="px-3 border-r border-primary-light">
          <img src={icon} className="w-6" alt="" />
        </span>

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <input
              {...field}
              value={value ?? ''}
              onChange={async (e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val)) {
                  onChange(val);
                  // await trigger(name);
                }
              }}
              type="text"
              maxLength={8}
              placeholder={placeholder}
              className="w-full flex-1 px-3 py-2.5 outline-none text-gray-900 placeholder:text-xs sm:placeholder:text-sm"
            />
          )}
        />

        <button
          type="button"
          onClick={decreaseAmount}
          className="px-4 py-2.5 font-bold bg-red-100 text-red-600 border-l border-primary-light"
        >
          -
        </button>

        <button
          type="button"
          onClick={() => increaseAmount(50)}
          className="px-4 py-2.5 font-bold bg-green-100 text-primary border-l border-primary-light"
        >
          +
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-600">{error.message as string}</p>}

      {/* Quick Amount Buttons */}
      {quickAmounts.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {quickAmounts.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => increaseAmount(v)}
              className="bg-primary-dark2 border-2 border-primary text-white py-2 rounded-md text-sm font-semibold"
            >
              +{v.toLocaleString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AmountInput;
