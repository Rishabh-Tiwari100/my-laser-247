import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLoginMutation, useDemoLoginMutation } from '@/store/api/authApi';
import { useVerifyMfaMutation } from '@/store/api/mfaApi';
import { useAppDispatch } from '@/hooks/redux';
import { setToken } from '@/store/slices/authSlice';
import {
  hasMinimumNationalPhoneLength,
  LoginFormData,
  loginSchema,
  phoneLoginSchema,
} from '@/utils/validations';
import { getPlatform } from '@/utils';

export type LoginMethod = 'phone' | 'userId';
export type LoginCredentialType = 'password' | 'otp';

const toInternationalMobile = (mobile: string) => `+${mobile.replace(/\D/g, '')}`;
const WELCOME_BANNER_PENDING_KEY = 'welcomeBannerPending';

const queueWelcomeBanner = () => {
  window.sessionStorage.setItem(WELCOME_BANNER_PENDING_KEY, 'true');
};

export const useLoginPage = (onSuccess?: () => void, loginMethod: LoginMethod = 'userId') => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginMethod === 'phone' ? phoneLoginSchema : loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const {
    reset,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;
  const [login, { isLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: isDemoLoading }] = useDemoLoginMutation();
  const [verifyMfa, { isLoading: isMfaVerifying }] = useVerifyMfaMutation();
  const deviceType = getPlatform();

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaMobile, setMfaMobile] = useState('');
  // const [captchaId, setCaptchaId] = useState('');
  // const [refreshKey, setRefreshKey] = useState(0);

  //handlers
  const handleLogin = async (
    data: LoginFormData,
    loginMethod: LoginMethod,
    credentialType: LoginCredentialType
  ) => {
    const credential = data.username.trim();

    if (loginMethod === 'phone') {
      const mobileDigits = credential.replace(/\D/g, '');
      if (!hasMinimumNationalPhoneLength(mobileDigits) || mobileDigits.length > 15) {
        setError('username', { type: 'validate', message: 'Please enter a valid mobile number' });
        return;
      }
    }

    if (loginMethod === 'phone' && credentialType === 'otp' && !/^\d{6}$/.test(data.password)) {
      setError('password', { type: 'validate', message: 'OTP must be exactly 6 digits' });
      return;
    }

    try {
      const device = deviceType ?? 'Desktop';
      const res =
        loginMethod === 'userId'
          ? await login({
              type: 'username_password',
              username: credential,
              password: data.password,
              device,
            }).unwrap()
          : credentialType === 'otp'
            ? await login({
                type: 'mobile_otp',
                mobile: toInternationalMobile(credential),
                otp: data.password,
                username: credential,
                password: data.password,
                device,
              }).unwrap()
            : await login({
                type: 'mobile_password',
                mobile: toInternationalMobile(credential),
                username: credential,
                password: data.password,
                device,
              }).unwrap();

      // if (!res?.passwordChanged) {
      //   dispatch(setTempAuthToken(res.accessToken));
      //   setShowChangePasswordModal(true);
      //   return;
      // }

      if (res?.mfaRequired && res?.mobile) {
        setMfaMobile(res.mobile);
        setShowMfaModal(true);
        return;
      }

      if (res?.accessToken) {
        queueWelcomeBanner();
        dispatch(setToken(res.accessToken));
        reset();
        onSuccess?.();
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed!', { id: 'login-failed' });
    }
    // finally {
    //   setRefreshKey((prev) => prev + 1);
    // }
  };

  const handleVerifyMfa = async (otp: string) => {
    try {
      const res = await verifyMfa({ mobile: mfaMobile, otp }).unwrap();

      if (res?.accessToken) {
        queueWelcomeBanner();
        dispatch(setToken(res.accessToken));
        setShowMfaModal(false);
        setMfaMobile('');
        reset();
        onSuccess?.();
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'MFA verification failed!', { id: 'mfa-verify-failed' });
    }
  };

  const handleCloseMfaModal = () => {
    setShowMfaModal(false);
    setMfaMobile('');
  };

  const handleDemoLogin = async () => {
    try {
      const res = await demoLogin().unwrap();
      if (res?.accessToken) {
        queueWelcomeBanner();
        setShowMfaModal(false);
        setMfaMobile('');
        dispatch(setToken(res.accessToken));
        reset();
        onSuccess?.();
        navigate('/', { replace: true });
        return;
      }

      toast.error('Demo login failed: access token missing', { id: 'demo-login' });
    } catch {
      toast.error('Demo login failed', { id: 'demo-login' });
    }
  };

  return {
    // form
    form,
    register,
    handleSubmit,

    // states
    showChangePasswordModal,
    showMfaModal,
    isLoading,
    isDemoLoading,
    isMfaVerifying,

    setShowChangePasswordModal,

    // handlers
    handleLogin,
    handleVerifyMfa,
    handleCloseMfaModal,
    handleDemoLogin,
  };
};
