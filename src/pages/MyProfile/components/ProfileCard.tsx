import React, { useEffect, useState } from 'react';
import { OtpTimer, PhoneInput } from '@/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOtpTimer } from '@/hooks';
import { RootState } from '@/store';
import { useSendOtpMutation } from '@/store/api/authApi';
import { useUpdateUserInfoMutation } from '@/store/api/userApi';
import { Icons } from '@/utils/icons';
import { profileValidationSchema } from '@/utils/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Value } from 'react-phone-number-input';
import { useSelector } from 'react-redux';

const ProfileCard = () => {
  const userInformation = useSelector((state: RootState) => state?.user?.profile);
  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation();
  const { timeLeft, active, start, reset: resetTimer } = useOtpTimer(120);
  const [isEdit, setIsEdit] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const [updateUserInfo, { isLoading: updateLoading }] = useUpdateUserInfoMutation();
  const { firstname, lastname, mobile, email, username, country, dialCode, id } =
    userInformation ?? {};

  const [phone, setPhone] = useState<{
    country?: string;
    countryCode: string;
    fullNumber: string;
    phoneNumber: string;
  }>({
    country: '',
    countryCode: '',
    fullNumber: '',
    phoneNumber: '',
  });

  type ProfileFormData = {
    username: string;
    firstname: string;
    lastname: string;
    mobile: string;
    email: string;
    dialCode: string;
    country: string;
    otp: string;
  };

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      mobile: '',
      email: '',
      dialCode: '',
      country: '',
      otp: '',
    },
  });

  useEffect(() => {
    if (userInformation) {
      setValue('username', username || '');
      setValue('firstname', firstname || '');
      setValue('lastname', lastname || '');
      setValue('email', email || '');
      setValue('mobile', mobile || '');
      setValue('dialCode', dialCode || '');
      setValue('country', country || '');

      // Update phone state
      setPhone({
        country: country || '',
        countryCode: dialCode || '',
        fullNumber: mobile || '',
        phoneNumber: mobile?.replace(dialCode ?? '', '') || '',
      });
    }
  }, [userInformation, username, firstname, lastname, email, mobile, dialCode, country, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    const toastId = toast.loading('Updating profile...');

    try {
      const payload = {
        id: Number(id),
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        dialCode: phone.countryCode,
        mobile: phone.fullNumber,
        email: data.email ? data.email : null,
        country: phone.country || 'BD',
        mobileVerificationCode: data.otp ? data.otp : '',
      };

      await updateUserInfo(payload).unwrap();
      toast.success('Profile updated successfully!', { id: toastId });

      setIsEdit(false);
      setShowOtpField(false);
      resetField('otp');
      resetTimer();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile.', { id: toastId });
    }
  };

  const handleSendOtp = async () => {
    const isValidPhone = await trigger('mobile');
    if (!isValidPhone) {
      toast.error('Please enter a valid phone number.', { id: 'otp-sent' });
      return;
    }

    const toastId = toast.loading('Sending OTP...');
    const payload = {
      mobile: phone.fullNumber,
      country: phone.country,
      type: 'register',
    };

    try {
      await sendOtp(payload).unwrap();
      toast.success('OTP sent successfully!', { id: toastId });
      setShowOtpField(true);
      start();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP', { id: toastId });
    }
  };

  const handleCancel = () => {
    if (userInformation) {
      reset({
        username: username || '',
        firstname: firstname || '',
        lastname: lastname || '',
        email: email || '',
        mobile: mobile || '',
        dialCode: dialCode || '',
        country: country || '',
        otp: '',
      });

      setPhone({
        country: country || '',
        countryCode: dialCode || '',
        fullNumber: mobile || '',
        phoneNumber: mobile?.replace(dialCode ?? '', '') || '',
      });
    }

    setIsEdit(false);
    setShowOtpField(false);
    resetTimer();
    resetField('otp');
  };

  const handleResetOtpField = () => {
    setShowOtpField(false);
    resetTimer();
    resetField('otp');
  };

  return (
    <div className="rounded-lg border-2 border-primary-light bg-white shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h1 className="text-xl font-bold text-gray-800">Profile Information</h1>

        {!isEdit ? (
          <Button
            onClick={() => setIsEdit(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-all duration-200 w-full sm:w-auto"
          >
            Cancel
          </Button>
        )}
      </div>

      <hr className="border-t-2 border-primary-light my-4 sm:my-6" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {/* Username */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 sm:items-center">
          <label className="text-sm font-semibold text-gray-700">Username</label>
          <div className="sm:col-span-2">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly
                  className={`w-full rounded-md px-3 py-2.5 border transition-all duration-200 outline-none bg-gray-50 border-gray-200 text-gray-600`}
                />
              )}
            />
            {errors.username && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* First Name */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 sm:items-center">
          <label className="text-sm font-semibold text-gray-700">First Name</label>
          <div className="sm:col-span-2">
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly={!isEdit}
                  className={`w-full rounded-md px-3 py-2.5 border transition-all duration-200 outline-none ${
                    !isEdit ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white border-primary'
                  }`}
                />
              )}
            />
            {errors.firstname && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.firstname.message}</p>
            )}
          </div>
        </div>

        {/* Last Name */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 sm:items-center">
          <label className="text-sm font-semibold text-gray-700">Last Name</label>
          <div className="sm:col-span-2">
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly={!isEdit}
                  className={`w-full rounded-md px-3 py-2.5 border transition-all duration-200 outline-none ${
                    !isEdit ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white border-primary'
                  }`}
                />
              )}
            />
            {errors.lastname && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 sm:items-center">
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <div className="sm:col-span-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly={!isEdit}
                  className={`w-full rounded-md px-3 py-2.5 border transition-all duration-200 outline-none ${
                    !isEdit
                      ? 'bg-gray-50 border-gray-200 text-gray-600'
                      : 'bg-white border-primary '
                  }`}
                />
              )}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Country */}
        {/* <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 sm:items-center">
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <div className="sm:col-span-2">
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  readOnly={!isEdit}
                  className={`w-full rounded-md px-3 py-2.5 border transition-all duration-200 outline-none ${
                    !isEdit ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white border-primary'
                  }`}
                />
              )}
            />
            {errors.country && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.country.message}</p>
            )}
          </div>
        </div> */}

        {/* Phone Number + OTP */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4">
          <label className="text-sm font-semibold text-gray-700 sm:pt-2">Phone Number</label>

          <div className="sm:col-span-2 space-y-3">
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="flex-1 bg-white pr-1 rounded-lg border-2 border-primary">
                    <PhoneInput
                      value={field.value as Value}
                      disabled={!isEdit || active}
                      onChange={(val) => {
                        setPhone(val);
                        return field.onChange(val.fullNumber);
                      }}
                    />
                  </div>
                  {isEdit && (
                    <Button
                      type="button"
                      disabled={otpLoading}
                      onClick={active ? handleResetOtpField : handleSendOtp}
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md whitespace-nowrap transition-all duration-200"
                    >
                      {otpLoading ? (
                        'Sending...'
                      ) : active ? (
                        'Change?'
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          Send OTP
                          <Icons.circularRightArrow />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              )}
            />
            {errors.mobile && (
              <p className="text-xs font-medium text-red-500">{errors.mobile.message}</p>
            )}

            {/* OTP Field */}
            {showOtpField && (
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                <OtpTimer
                  timeLeft={timeLeft}
                  active={active}
                  onResend={() => {
                    resetTimer();
                    handleSendOtp();
                  }}
                  className="!text-gray-700 mb-3"
                />

                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="w-full border-2 border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                      />
                      {errors.otp && (
                        <p className="text-xs font-medium text-red-500 mt-1">
                          {errors.otp.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        {isEdit && (
          <div className="pt-4 border-t-2 border-gray-100">
            <Button
              type="submit"
              disabled={isSubmitting || updateLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || updateLoading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileCard;
