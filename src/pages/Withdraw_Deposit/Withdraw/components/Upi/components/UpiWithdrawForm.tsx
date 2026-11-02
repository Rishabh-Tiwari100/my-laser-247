import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import LoaderTwo from '@/components/common/LoaderTwo';
import { useDepositWithdrawRequestMutation } from '@/store/api/accountApi';
import type { UpiAccount } from '@/types/account';
import OtpModal from '@/components/common/OtpModal';
import { useState } from 'react';
import { useCurrentUser } from '@/hooks';

interface UpiWithdrawFormProps {
  account: UpiAccount;
  availableBalance: string;
}

interface FormType {
  amount: string;
}

const getPositiveAmount = (value: number | null, fallback: number) =>
  Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;

const getAmountSchema = (min: number, max: number) =>
  z.object({
    amount: z
      .string({ required_error: 'Amount is required' })
      .min(1, 'Amount is required')
      .refine((value) => /^[0-9]+$/.test(value), {
        message: 'Please enter a valid number',
      })
      .refine((value) => Number(value) >= min, {
        message: `Minimum amount is ${min.toLocaleString()}`,
      })
      .refine((value) => Number(value) <= max, {
        message: `Maximum amount is ${max.toLocaleString()}`,
      }),
  });

function UpiWithdrawForm({ account, availableBalance }: UpiWithdrawFormProps) {
  const min = getPositiveAmount(account.minAmount, 100);
  const max = Math.max(min, getPositiveAmount(account.maxAmount, 1000000));
  const user = useCurrentUser();
  const isMfaEnabled = user?.isMfaEnabled === true;
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState('');
  const [isMfaSubmitting, setIsMfaSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(getAmountSchema(min, max)),
    defaultValues: { amount: '' },
  });
  const [createRequest, { isLoading: isSubmitting }] = useDepositWithdrawRequestMutation();

  const handleFormSubmit = async ({ amount }: FormType) => {
    if (!isMfaEnabled) {
      await submitRequest(amount);
      return;
    }

    setPendingAmount(amount);
    setOtpModalOpen(true);
  };

  const submitRequest = async (amount: string, mfaCode?: string) => {
    const toastOptions = { id: `upi-withdraw-${account.id}` };
    const isMfaFlow = Boolean(mfaCode);
    if (isMfaFlow) setIsMfaSubmitting(true);
    try {
      const response = await createRequest({
        method: 'upi',
        type: 'Debit',
        amount: Number(amount),
        UPI: Number(account.id),
        ...(mfaCode
          ? {
              mfaCode,
              mfaOtp: mfaCode,
            }
          : {}),
      }).unwrap();
      toast.success(response.message || 'Withdrawal request submitted successfully', toastOptions);
      reset();
      if (isMfaFlow) {
        setOtpModalOpen(false);
        setPendingAmount('');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to withdraw money', toastOptions);
    } finally {
      if (isMfaFlow) setIsMfaSubmitting(false);
    }
  };

  const handleMfaClose = () => {
    setOtpModalOpen(false);
    setPendingAmount('');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-[12px]">
      <div className="mb-[7px] flex items-center justify-between gap-[12px] text-[13px]">
        <p className="shrink-0 font-semibold">Withdraw</p>
        <p className="min-w-0 flex-1 truncate text-right font-normal">
          Available Balance: <span className="font-semibold">{availableBalance}</span>
        </p>
      </div>

      <input
        {...register('amount')}
        inputMode="numeric"
        maxLength={8}
        placeholder="Enter Withdrawal Amount"
        onInput={(event) => {
          event.currentTarget.value = event.currentTarget.value.replace(/\D+/g, '');
        }}
        className="h-[45px] w-full rounded-[5px] border border-[#999] px-[13px] text-sm outline-none placeholder:text-[#5f7183] focus:border-[#243a48]"
      />
      {errors.amount && (
        <p className="mt-[4px] text-[12px] text-red-600">{errors.amount.message}</p>
      )}
      <p className="mt-[3px] break-words text-right text-[13px] font-semibold text-[#000]">
        Min: {min.toLocaleString()} | Max: {max.toLocaleString()}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-[18px] flex h-[38px] w-full items-center justify-center rounded-[2px] bg-[#dc7b7e] text-sm uppercase text-white hover:brightness-95 disabled:opacity-60"
      >
        {isSubmitting ? <LoaderTwo text="Submitting..." /> : 'Withdraw'}
      </button>
      <OtpModal
        isOpen={otpModalOpen && isMfaEnabled}
        onClose={handleMfaClose}
        onSubmit={(mfaCode) => submitRequest(pendingAmount, mfaCode)}
        isLoading={isMfaSubmitting}
        title="Enter MFA OTP"
        description="Enter the 6-digit MFA code to submit your withdrawal request."
        submitLabel="Submit"
      />
    </form>
  );
}

export default UpiWithdrawForm;
