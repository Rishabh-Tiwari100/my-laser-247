import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/common/CustomInput';
import { changePasswordSchema, ChangePasswordFormData } from '@/utils/validations';
import { useChangePasswordMutation } from '@/store/api/authApi';
import toast from 'react-hot-toast';
import PasswordInput from '@/components/common/PasswordInput';

interface ChangePasswordProps {
  setShowChangePasswordModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChangePassword({ setShowChangePasswordModal }: ChangePasswordProps) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const toastId = { id: 'change-password' };
    try {
      const payload = {
        oldPassword: data.oldPassword.trim(),
        newPassword: data.newPassword.trim(),
      };

      await changePassword(payload).unwrap();
      toast.success('Password changed successfully!', toastId);
      reset();
      setShowChangePasswordModal?.(false);
    } catch (err: any) {
      console.error('Failed to change password:', err);
      toast.error(err?.data?.message || 'Failed to change password. Please try again.', toastId);
    }
  };

  return (
    <div className="w-full lg:w-[87%] lg:px-3 my-1">
      <h3 className="bg-[#212121] px-2 py-[6px] text-sm font-semibold leading-[17px] text-white">
        Change Password
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[10px] py-[10px]">
        <PasswordInput<ChangePasswordFormData>
          name="oldPassword"
          control={control}
          placeholder="Enter Current Password*"
          autoComplete="current-password"
        />

        <PasswordInput<ChangePasswordFormData>
          name="newPassword"
          control={control}
          placeholder="Enter New Password*"
          autoComplete="new-password"
        />

        <PasswordInput<ChangePasswordFormData>
          name="confirmPassword"
          control={control}
          placeholder="Enter Confirm New Password*"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="h-[35px] w-full rounded-[3px] bg-[#212121] text-sm font-semibold text-white hover:bg-[#212121] disabled:opacity-70"
        >
          {isLoading || isSubmitting ? 'Changing Password...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
