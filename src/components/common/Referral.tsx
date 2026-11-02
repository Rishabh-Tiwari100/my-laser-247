import React from 'react';
import { Icons } from '@/utils/icons';
import { useClipboard } from '@/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Referral = () => {
  const { copy } = useClipboard();
  const user = useSelector((s: RootState) => s.user.profile);
  const referralCode = user?.referralCode || '';
  const completedReferrals = 0;
  const acceptedReferrals = 0;

  const baseUrl = import.meta.env.VITE_APP_URL;
  const referralUrl = `${baseUrl}/register?ref=${referralCode}`;

  const handleCopyCode = () => {
    if (referralCode) {
      copy(referralCode);
    }
  };

  const handleCopyLink = () => {
    if (referralCode) {
      copy(referralUrl);
    }
  };

  const handleShare = async () => {
    if (!referralCode) return;

    // Use Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this platform!',
          text: `Use my referral code: ${referralCode}`,
          url: referralUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className=" bg-white shadow-sm ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Referral Program</h1>
        <div className="bg-primary/10 p-2 rounded-full">
          <Icons.share className="w-5 h-5 text-primary" />
        </div>
      </div>

      <hr className="border-t-2 border-primary-light mb-4 sm:mb-6" />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-2 py-3 sm:p-5 rounded-lg border border-primary/20">
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
            Refer a friend and earn referral bonus 🎁
          </h4>

          {/* Referral Code Display */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 bg-white border-2 border-primary rounded-lg px-4 py-2 font-mono text-lg font-bold text-primary text-center sm:text-left">
              {referralCode || 'N/A'}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                disabled={!referralCode}
                className="flex-1 sm:flex-initial px-2 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title="Copy referral code"
              >
                <Icons.copy className="w-4 h-4" />
                <span className="sm:inline">Copy Code</span>
              </button>

              <button
                onClick={handleShare}
                disabled={!referralCode}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-2.5 bg-primary/70 hover:bg-primary/80 text-white font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                title="Share referral link"
              >
                <Icons.share className="w-4 h-4" />
                <span className="sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Referral URL Display */}
          {referralCode && (
            <div className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white/50 rounded-lg p-3 border border-primary/10">
              <span className="text-13 text-gray-500 font-semibold">Referral Link:</span>
              <div className="flex-1 flex items-center gap-2">
                <code className="flex-1 text-13 text-gray-600 bg-white px-3 py-1.5 rounded border truncate">
                  {referralUrl}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors active:scale-95"
                  title="Copy referral link"
                >
                  <Icons.copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Referral Status Section */}
        <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border-2 border-gray-200">
          <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">
            Your Referral Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Completed Referrals */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <Icons.circleCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">{completedReferrals}</p>
                </div>
              </div>
            </div>

            {/* Accepted Referrals */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-500 p-2.5 rounded-full">
                  <Icons.userGroup />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Accepted</p>
                  <p className="text-2xl font-bold text-gray-800">{acceptedReferrals}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
