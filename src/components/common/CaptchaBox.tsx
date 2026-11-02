import React, { useEffect } from 'react';
import { useLazyGetCaptchaQuery } from '@/store/api/authApi';
import { useLocation } from 'react-router-dom';

interface CaptchaBoxProps {
  onCaptchaChange: (id: string) => void;
  refreshTrigger?: number; // changes when parent wants to refetch
  autoFetch?: boolean; // optionally allow automatic fetching
}

const CaptchaBox: React.FC<CaptchaBoxProps> = ({
  onCaptchaChange,
  refreshTrigger,
  autoFetch = true,
}) => {
  const { pathname } = useLocation();
  const [getCaptcha, { data, isFetching }] = useLazyGetCaptchaQuery();

  useEffect(() => {
    if (pathname !== '/login') return;
    const interval = setInterval(() => {
      getCaptcha();
    }, 115000);
    return () => clearInterval(interval);
  }, [pathname]);

  // Fetch on mount only if autoFetch = true
  useEffect(() => {
    if (autoFetch) getCaptcha();
  }, [autoFetch, getCaptcha]);

  // Triggered manually when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger !== undefined) getCaptcha();
  }, [refreshTrigger, getCaptcha]);

  // Update parent when new captcha is fetched
  useEffect(() => {
    if (data?.captchaId) onCaptchaChange(data.captchaId);
  }, [data, onCaptchaChange]);

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      {isFetching ? (
        <p className="text-gray-400 text-sm">Loading captcha...</p>
      ) : data?.svg ? (
        <div className="border border-gray-300" dangerouslySetInnerHTML={{ __html: data.svg }} />
      ) : (
        <p className="text-gray-400 text-sm">Unable to load captcha.</p>
      )}

      <button
        type="button"
        onClick={() => getCaptcha()}
        className="text-xs text-primary-light hover:underline"
      >
        Refresh Captcha
      </button>
    </div>
  );
};

export default CaptchaBox;
