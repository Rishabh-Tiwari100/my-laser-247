import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { RegisterFormData, registerSchema } from '@/utils/validations';
import { useRegisterUserMutation, useSendOtpMutation } from '@/store/api/authApi';
import { useOtpTimer } from '@/hooks';
import type { PhoneCountry } from '../components/AuthPhoneNumberInput';

const toInternationalMobile = (mobile: string) => `+${mobile.replace(/\D/g, '')}`;

export const useRegister = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const referralCode = params.get('ref');

  const [showOtpField, setShowOtpField] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>({
    code: 'IN',
    dialCode: '91',
  });

  const { timeLeft, active, start, reset: resetTimer } = useOtpTimer(300);

  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation();
  const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      mobile: '',
      username: '',
      referralCode: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { trigger, reset, resetField, setError, setValue, getValues } = form;

  useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode, { shouldValidate: true });
    }
  }, [referralCode, setValue]);

  const handleSendOtp = useCallback(async () => {
    const isValid = await trigger('mobile');
    if (!isValid) {
      toast.error('Please enter a valid phone number.', { id: 'valid-otp' });
      return;
    }

    const mobile = toInternationalMobile(getValues('mobile'));
    const toastId = toast.loading('Sending OTP...');
    try {
      await sendOtp({
        mobile,
        country: phoneCountry.code,
        type: 'register',
      }).unwrap();

      toast.success(`OTP sent to ${mobile}`, { id: toastId });
      setShowOtpField(true);
      start();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP', { id: toastId });
    }
  }, [getValues, phoneCountry.code, sendOtp, start, trigger]);

  const handleSubmitForm = async (data: RegisterFormData, includeUsername: boolean) => {
    if (showOtpField && !data.otp) {
      setError('otp', {
        type: 'required',
        message: 'Please enter the OTP sent to your mobile number',
      });
      return;
    }

    const username = data.username?.trim();
    if (includeUsername && !username) {
      setError('username', {
        type: 'required',
        message: 'Please enter a User ID',
      });
      return;
    }

    const toastId = toast.loading('Creating your account...');
    const mobile = toInternationalMobile(data.mobile);

    try {
      await registerUser({
        ...(includeUsername && username ? { username } : {}),
        password: data.password,
        dialCode: `+${phoneCountry.dialCode}`,
        mobile,
        country: phoneCountry.code,
        referralCode: data.referralCode?.trim() || undefined,
        mobileVerificationCode: data.otp || undefined,
      }).unwrap();

      toast.success('Account created successfully!', { id: toastId });
      reset();
      setShowOtpField(false);
      resetTimer();
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Registration failed';
      if (String(errorMessage).toLowerCase().includes('verification code')) {
        resetField('otp');
      }
      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  return {
    form,
    phoneCountry,
    setPhoneCountry,

    referralCode,

    showOtpField,
    timeLeft,
    active,

    otpLoading,
    registerLoading,

    handleSendOtp,
    handleSubmitForm,
  };
};
