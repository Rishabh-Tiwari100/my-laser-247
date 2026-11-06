import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordFormData } from '@/utils/validations';
import { useChangePasswordMutation } from '@/store/api/authApi';
import toast from 'react-hot-toast';

interface ChangePasswordProps {
  setShowChangePasswordModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChangePassword({ setShowChangePasswordModal }: ChangePasswordProps) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
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
    <section
      className="mt-[5px] lg:mt-[8px] w-full bg-white font-helvetica text-[14px] text-black"
      aria-labelledby="change-password-title"
    >
      <h1
        id="change-password-title"
        className="m-0 flex h-[28px] items-center bg-[#212121] px-[6px] text-[14px] font-bold leading-[21px] text-white"
      >
        Change Password
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="p-[10px]" noValidate>
        <div className={setShowChangePasswordModal ? 'w-full' : 'w-full lg:w-[calc(50%_-_12px)]'}>
          {(
            [
              { name: 'oldPassword', label: 'Old Password', autoComplete: 'current-password' },
              { name: 'newPassword', label: 'New Password', autoComplete: 'new-password' },
              { name: 'confirmPassword', label: 'Confirm Password', autoComplete: 'new-password' },
            ] as const
          ).map(({ name, label, autoComplete }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-[14px] font-normal leading-[21px] text-[#6c757d]"
              >
                {label}
              </label>
              <input
                {...register(name)}
                id={name}
                type="password"
                autoComplete={autoComplete}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `${name}-error` : undefined}
                className="block h-[37.375px] w-full rounded-[3px] border border-[#ced4da] bg-white px-[14.4px] py-[7.2px] text-[14px] leading-[21px] text-[#212529] shadow-[0_1px_4px_#0000001a] outline-none focus:border-[#80bdff] focus:ring-1 focus:ring-[#80bdff]"
              />
              {errors[name] && (
                <p
                  id={`${name}-error`}
                  role="alert"
                  className="mt-[3px] text-[12px] leading-[18px] text-red-600"
                >
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="mt-[12px] h-[37.375px] rounded-[2px] border border-transparent bg-[#212121] px-[14.4px] py-[7.2px] text-[14px] font-normal uppercase leading-[21px] text-white hover:bg-[#333] disabled:cursor-wait disabled:opacity-70"
        >
          {isLoading || isSubmitting ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </section>
  );
}

export default ChangePassword;
