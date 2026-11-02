import React from 'react';
import { X } from 'lucide-react';
import { Icons } from '@/utils/icons';
import { useLoginPage } from '@/pages/Auth/hooks/useLogin';
import { sanitizeAlphaNumeric } from '@/utils';
import OtpModal from '@/components/common/OtpModal';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    handleLogin,
    handleVerifyMfa,
    handleCloseMfaModal,
    isLoading,
    showMfaModal,
    isMfaVerifying,
  } = useLoginPage(onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[999999]">
      <div className="relative flex h-[405px] w-[540px] overflow-hidden rounded-[10px] bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded bg-slate-700 text-white hover:bg-slate-800"
        >
          <X size={14} />
        </button>

        {/* Left Image */}
        <div className="w-[250px] shrink-0">
          <img
            src="images/bg-login_wrap-ninewickets.webp"
            alt="Nine Wickets"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side */}
        <form
          onSubmit={handleSubmit((data) => handleLogin(data, 'userId', 'password'))}
          className="flex flex-1 flex-col px-6 pt-16"
        >
          <h2 className="mb-5 text-[18px] font-normal text-[#222]">Please login to continue</h2>

          <input
            type="text"
            placeholder="Username"
            className="mb-2 h-[34px] rounded border border-gray-300 px-3 text-sm outline-none focus:border-gray-400"
            autoComplete="username"
            {...register('username', {
              required: true,
              pattern: /^[a-zA-Z0-9-_]+$/,
              maxLength: 50,
            })}
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-4 h-[34px] rounded border border-gray-300 px-3 text-sm outline-none focus:border-gray-400"
            autoComplete="current-password"
            onInput={(event) => {
              event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
            }}
            {...register('password', {
              required: true,
              maxLength: 20,
            })}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-1 h-[38px] whitespace-nowrap rounded bg-gradient-to-b from-[#FDB61F] to-[#F59E00] text-base font-bold text-black"
          >
            {isLoading ? (
              <>Logging in...</>
            ) : (
              <>
                <span>Login</span>
                <Icons.login className="shrink-0" />
              </>
            )}
          </button>
        </form>
      </div>

      <OtpModal
        isOpen={showMfaModal}
        onClose={handleCloseMfaModal}
        onSubmit={handleVerifyMfa}
        isLoading={isMfaVerifying}
        title="Enter MFA OTP"
        description="Enter the 6-digit code from your authenticator app to complete login."
        submitLabel="Verify & Login"
      />
    </div>
  );
};

export default LoginModal;
