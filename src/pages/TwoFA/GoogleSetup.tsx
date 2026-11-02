import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { IoQrCodeOutline } from 'react-icons/io5';
import { TwoFaShell, GoogleBadge, CopyKeyField, QrModal } from './components';
import { Icons } from '@/utils/icons';
import { useCurrentUser, useIsAuthenticated, useIsDemoUser } from '@/hooks';
import { useSetupMfaMutation } from '@/store/api/mfaApi';
import toast from 'react-hot-toast';
import NotOutLoader from '@/components/common/NotOutLoader';

type ApiError = {
  data?: {
    message?: string;
  };
};

export default function GoogleSetup() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const user = useCurrentUser();

  const [showQr, setShowQr] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [setupError, setSetupError] = useState('');

  const [setupMfa, { isLoading }] = useSetupMfaMutation();

  const mobileOrEmail = user?.email || user?.mobile || '';

  const fetchSetup = async () => {
    if (!mobileOrEmail) return;

    setSetupError('');

    try {
      const response = await setupMfa({ mobileOrEmail }).unwrap();

      if (!response?.secret || !response?.qrCode) {
        throw new Error('Failed to generate authenticator key. Please retry.');
      }

      setSecretKey(response.secret);
      setQrCode(response.qrCode);
    } catch (err) {
      const error = err as ApiError;

      const message =
        error.data?.message ||
        (err instanceof Error ? err.message : 'Failed to setup authenticator.');

      setSetupError(message);
      toast.error(message, { id: 'mfa-setup' });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) return;
    if (user.isMfaEnabled) return;
    if (!mobileOrEmail) return;

    fetchSetup();
  }, [isAuthenticated, user, mobileOrEmail]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <NotOutLoader />;
  }

  if (isDemoUser) {
    return <Navigate to="/" replace />;
  }

  if (user.isMfaEnabled) {
    return <Navigate to="/2fa/edit-2fa" replace />;
  }

  const isGeneratingKey = isLoading && !secretKey && !setupError;

  return (
    <>
      <TwoFaShell
        title="Setup With Google"
        icon={<GoogleBadge />}
        footer={
          <button
            type="button"
            disabled={!secretKey || isLoading}
            onClick={() => navigate('/2fa/google/verify')}
            className="flex min-h-[44px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-theme-navbar text-[14px] font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#dfdfdf] disabled:bg-none disabled:text-[#737373] disabled:opacity-100"
          >
            {isLoading ? 'Setting up...' : 'Next'}
            <span aria-hidden="true">
              <Icons.arrowRight />
            </span>
          </button>
        }
      >
        <div className="min-h-[480px]">
          <div className="border-b border-[#ededed] pb-[10px]">
            <h2 className="text-[16px] font-bold text-[#2789ce]">
              Instructions For Setup
            </h2>
          </div>

          <div className="pt-4 text-[#00223c]">
            <section>
              <h3 className="mb-[15px] text-[14px] font-medium">
                1. Download an authentication app
              </h3>
              <p className="mt-[-10px] mb-[15px] text-[13px] leading-[1.5] text-[#515151]">
                We recommend downloading{' '}
                <span className="text-[#2d8fd7]">
                  Google Authenticator
                </span>{' '}
                if you don't have one installed.
              </p>
            </section>

            <section>
              <h3 className="mb-[15px] text-[14px] font-medium">
                2. Scan this barcode/QR code or copy the key
              </h3>

              <p className="mt-[-10px] mb-[15px] text-[13px] leading-[1.5] text-[#515151]">
                Scan the QR code in the authentication app or copy the key and
                paste it in the app.
              </p>

              <div className="mt-[-3px]">
                <div className="mb-2 text-[14px] font-medium text-[#00223c]">
                  Key
                </div>

                {isGeneratingKey ? (
                  <div className="flex h-[54px] items-center justify-between rounded-[5px] border border-[#d4dce2] bg-[#eaf0f4] px-4 text-[14px] text-[#667080]">
                    <span>Generating secure key...</span>
                    <span className="h-3 w-3 animate-pulse rounded-full bg-[#1672d8]" />
                  </div>
                ) : secretKey ? (
                  <>
                    <CopyKeyField value={secretKey} />

                    <div className="my-2 text-center text-[12px] text-[#8091a3]">
                      OR
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowQr(true)}
                      className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[7px] border border-[#3d94e2] text-[13px] font-semibold text-[#1672d8] transition hover:bg-[#f4f9ff]"
                    >
                      <IoQrCodeOutline className="h-4 w-4" />
                      View barcode/QR code
                    </button>
                  </>
                ) : (
                  <div className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    Unable to load the setup key. Please retry setup.
                  </div>
                )}
              </div>
            </section>

            <section className="mt-[15px]">
              <h3 className="mb-[15px] text-[14px] font-medium">
                3. Copy and enter 6-digit code
              </h3>

              <p className="mt-[-10px] text-[13px] leading-[1.5] text-[#515151]">
                After scanning/entering the key, your authenticator app will
                generate a 6-digit code.{' '}
                <span className="text-[#2d8fd7]">
                  Copy the code and come back to enter it.
                </span>
              </p>
            </section>

            {setupError && (
              <section className="mt-5 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-[13px] font-medium text-red-700">
                  {setupError}
                </p>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setSecretKey('');
                    setQrCode('');
                    fetchSetup();
                  }}
                  className="mt-3 inline-flex h-[36px] items-center justify-center rounded-[6px] bg-red-600 px-4 text-[13px] font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Retrying...' : 'Retry Setup'}
                </button>
              </section>
            )}
          </div>
        </div>
      </TwoFaShell>

      <QrModal
        open={showQr}
        onClose={() => setShowQr(false)}
        secretKey={secretKey}
        qrCode={qrCode}
      />
    </>
  );
}
