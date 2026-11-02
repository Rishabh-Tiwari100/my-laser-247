import { FormEvent, useEffect, useState } from 'react';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaChevronLeft } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useSendOtpMutation } from '@/store/api/authApi';
import { useUpdateUserInfoMutation } from '@/store/api/userApi';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export default function UpdateMobileNumber() {
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);
  const [mobile, setMobile] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<CountryData | null>(null);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation();
  const [updateUserInfo, { isLoading: updateLoading }] = useUpdateUserInfoMutation();

  useEffect(() => {
    if (profile?.mobile) setMobile(onlyDigits(profile.mobile));
  }, [profile?.mobile]);

  useEffect(() => {
    if (!otpTimer) return;

    const timer = window.setInterval(() => {
      setOtpTimer((currentTimer) => Math.max(currentTimer - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [otpTimer]);

  const handleGetOtp = async () => {
    const enteredNumber = onlyDigits(mobile);

    if (enteredNumber.length < 7) {
      toast.error('Please enter a valid mobile number.');
      return;
    }

    const toastId = toast.loading('Sending OTP...');
    try {
      await sendOtp({
        mobile: `+${enteredNumber}`,
        country: phoneCountry?.countryCode?.toUpperCase() || profile?.country,
        type: 'register',
      }).unwrap();
      setOtpSent(true);
      setOtpTimer(5 * 60);
      toast.success('OTP sent successfully.', { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send OTP.', { id: toastId });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const enteredNumber = onlyDigits(mobile);

    if (enteredNumber.length < 7) {
      toast.error('Please enter a valid mobile number.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Please enter the 6-digit OTP.');
      return;
    }
    if (!profile) return;

    const toastId = toast.loading('Updating mobile number...');
    try {
      await updateUserInfo({
        id: profile.id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        username: profile.username,
        email: profile.email,
        dialCode: phoneCountry?.dialCode ? `+${phoneCountry.dialCode}` : profile.dialCode,
        mobile: `+${enteredNumber}`,
        country: phoneCountry?.countryCode?.toUpperCase() || profile.country,
        mobileVerificationCode: otp,
      }).unwrap();
      toast.success('Mobile number updated successfully.', { id: toastId });
      navigate('/my-account/profile');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update mobile number.', { id: toastId });
    }
  };

  const defaultCountry = (profile?.country || 'IN').toLowerCase();
  const otpTimerLabel = `${Math.floor(otpTimer / 60)
    .toString()
    .padStart(2, '0')}:${(otpTimer % 60).toString().padStart(2, '0')}`;

  return (
    <section className="w-full p-[10px]">
      <div className="overflow-hidden">
        <header className="flex h-[34px] items-center gap-2 bg-[#212121] px-[9px] text-[14px] font-bold text-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-5 w-4 items-center justify-start"
          >
            <FaChevronLeft className="h-[13px] w-[13px]" />
          </button>
          <h1>Update Mobile Number</h1>
        </header>

        <form onSubmit={handleSubmit} className="min-h-[calc(100vh-205px)] px-[12px] py-[13px]">
          <div
            className={`flex h-[41px] w-full overflow-hidden rounded-[5px] border border-[#cdd5da] shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
              otpSent ? 'bg-[#c6c6c6]' : 'bg-white'
            }`}
          >
            <PhoneInput
              country={defaultCountry as any}
              value={mobile}
              disabled={otpSent}
              onChange={(value, country) => {
                setMobile(value);
                setPhoneCountry(country as CountryData);
                setOtp('');
                setOtpSent(false);
                setOtpTimer(0);
              }}
              placeholder="Enter Mobile Number*"
              buttonClass={`!border-0 ${
                otpSent ? '!bg-[#c6c6c6] hover:!bg-[#c6c6c6]' : '!bg-white hover:!bg-white'
              }`}
              containerClass="!h-full !w-full"
              inputClass={`!h-full !w-full !rounded-none !border-0 !text-[14px] !text-[#333] focus:!shadow-none ${
                otpSent ? '!bg-[#c6c6c6]' : '!bg-white'
              }`}
              dropdownClass="!text-sm"
            />
            <button
              type="button"
              onClick={handleGetOtp}
              disabled={otpLoading || (otpSent && otpTimer > 0)}
              className="flex min-w-[76px] shrink-0 items-center justify-center bg-[#5f89da] px-[10px] text-[14px] font-bold text-white hover:bg-[#4f79c9] disabled:cursor-not-allowed disabled:opacity-90"
            >
              {otpLoading
                ? '...'
                : otpSent && otpTimer > 0
                  ? otpTimerLabel
                  : otpSent
                    ? 'Resend'
                    : 'OTP'}
            </button>
          </div>

          {otpSent && (
            <div className="mt-[10px] flex h-[41px] w-full overflow-hidden rounded-[5px] border border-[#cdd5da] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex h-full w-full items-center gap-[9px] px-[12px]">
                <FiLock className="h-[18px] w-[18px] shrink-0 text-black" />
                <input
                  value={otp}
                  onChange={(event) => setOtp(onlyDigits(event.target.value).slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter OTP*"
                  className="h-full w-full border-0 text-[14px] text-[#333] outline-none placeholder:text-[#667080]"
                />
              </div>
              <button
                type="submit"
                disabled={updateLoading}
                className="flex min-w-[76px] shrink-0 items-center justify-center bg-[#5f89da] px-[10px] text-[14px] font-bold text-white hover:bg-[#4f79c9] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {updateLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
