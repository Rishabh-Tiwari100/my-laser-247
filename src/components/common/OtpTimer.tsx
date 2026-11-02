import React from 'react';

interface OtpTimerProps {
  className?: string;
  timeLeft: number;
  active: boolean;
  onResend: () => void;
}

const formatTime = (seconds: number) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const OtpTimer: React.FC<OtpTimerProps> = ({ className, timeLeft, active, onResend }) => {
  return (
    <div className={`flex justify-between mt-1 text-xs text-white ${className}`}>
      {active && timeLeft > 0 ? (
        <span>
          Resend OTP in <span className="font-semibold text-primary">{formatTime(timeLeft)}</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="text-primary font-semibold hover:underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};

export default OtpTimer;
