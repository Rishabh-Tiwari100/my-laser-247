import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { ForgotPasswordFormData, forgotPasswordSchema } from '@/utils/validations';

import { useForgotPasswordMutation, useResetPasswordMutation } from '@/store/api/authApi';

import { useOtpTimer } from '@/hooks';

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const { timeLeft, active, start, reset: resetTimer } = useOtpTimer(120);

  const [forgotPassword, { isLoading: sendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { trigger, resetField, getValues, reset } = form;

  const handleSendOtp = useCallback(async () => {
    const isValid = await trigger('phone');
    const toastId = { id: 'send-otp' };
    if (!isValid) return;

    try {
      const phoneValue = getValues('phone');
      await forgotPassword({ mobile: phoneValue }).unwrap();

      toast.success('OTP sent successfully!', toastId);
      setShowOtpField(true);
      start();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP', toastId);
    }
  }, [trigger, getValues, forgotPassword, start]);

  const handleResetOtpField = useCallback(() => {
    setShowOtpField(false);
    resetTimer();
    resetField('otp');
  }, [resetField, resetTimer]);

  const handleSubmitForm = useCallback(
    async (data: ForgotPasswordFormData) => {
      const toastId = { id: 'password-reset' };
      try {
        await resetPassword({
          mobile: data.phone,
          code: data.otp,
          newPassword: data.newPassword,
        }).unwrap();

        toast.success('Password reset successful!', toastId);
        reset();
        handleResetOtpField();
        navigate('/login');
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to reset password', toastId);
      }
    },
    [handleResetOtpField, navigate, reset, resetPassword]
  );

  return {
    form,
    showOtpField,

    timeLeft,
    active,

    // flags
    sendingOtp,
    resetting,

    // handlers
    resetTimer,
    handleSendOtp,
    handleSubmitForm,
    handleResetOtpField,
  };
};
