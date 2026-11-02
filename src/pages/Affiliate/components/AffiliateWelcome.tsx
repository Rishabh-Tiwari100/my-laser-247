import { ReasonFormModal } from '@/components/modals/ReasonFormModal';
import { useCreateAffiliateMutation } from '@/store/api/affiliateApi';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const affiliateBenefits = [
  {
    icon: '/images/affiliate/benifit-1.svg',
    text: 'Earn 20-30% commission on active user losses',
  },
  {
    icon: '/images/affiliate/benifit-2.svg',
    text: 'Automatic weekly commission payouts',
  },
  {
    icon: '/images/affiliate/benifit-3.svg',
    text: 'Unique referral code for tracking',
  },
  {
    icon: '/images/affiliate/benifit-4.svg',
    text: 'Transparent commission calculation',
  },
  {
    icon: '/images/affiliate/benifit-5.svg',
    text: 'Complete wallet transaction history',
  },
];

const AffiliateWelcome: React.FC<{
  status?: 'Not Applied' | 'Pending' | 'Rejected';
  reason?: string;
}> = ({ status, reason }) => {
  const [open, setOpen] = useState(false);
  const [createAffiliate, { data, isLoading, error }] = useCreateAffiliateMutation();

  const submitHandler = async (text: string) => {
    const toastId = { id: 'affiliate' };
    try {
      const res = await createAffiliate({ reasonFrom: text }).unwrap();
      toast.success(res?.message || 'Affiliate request submitted successfully!', toastId);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.error || 'Something went wrong. Please try again.';
      toast.error(errorMessage, toastId);
    }
  };

  const displayContent = () => {
    if (status === 'Pending') {
      return (
        <div className="rounded-xl bg-yellow-50 p-6 md:flex items-center gap-12 lg:max-w-[80%] mx-auto">
          <img
            src="/images/affiliate/affiliate.svg"
            alt="Affiliate illustration"
            className="w-[250px] 2xl:w-[350px] mx-auto md:mx-0"
          />

          {/* Content */}
          <div className="text-center md:text-left space-y-4 flex flex-col justify-center items-center mt-3">
            <p className="text-gray-700 text-base xl:text-lg font-medium leading-relaxed text-center max-w-96">
              Your affiliate request has been successfully submitted and is currently under review.
              We'll notify you once it's approved.
            </p>

            <span className="bg-yellow-100 text-yellow-700 px-6 py-1.5 font-semibold rounded-md">
              STATUS: PENDING
            </span>
          </div>
        </div>
      );
    } else if (status === 'Rejected') {
      return (
        <div className="rounded-xl bg-red-50 p-6 md:flex items-center gap-12 lg:max-w-[80%] mx-auto">
          <img
            src="/images/affiliate/affiliate.svg"
            alt="Affiliate illustration"
            className="w-[250px] 2xl:w-[350px] mx-auto md:mx-0"
          />

          {/* Content */}
          <div className="text-center md:text-left space-y-4 flex flex-col justify-center items-center mt-3">
            <p className="text-gray-700 text-base xl:text-lg font-medium leading-relaxed text-center max-w-96">
              Unfortunately, your affiliate request was not approved at this time.
            </p>

            {reason && (
              <div className="bg-white border border-red-200 rounded-md p-3 text-sm text-red-600 max-w-96">
                <strong>Reason:</strong> {reason}
              </div>
            )}

            <button
              onClick={() => {
                setOpen((prev) => !prev);
              }}
              className="bg-primary text-white px-6 py-1.5 font-semibold rounded-md shadow-solid-black transition"
            >
              REAPPLY FOR AFFILIATE
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="rounded-xl bg-green-50 p-6 md:flex items-center gap-12 lg:max-w-[80%] mx-auto">
          <img
            src="/images/affiliate/affiliate.svg"
            alt="Affiliate illustration"
            className="w-[250px] 2xl:w-[350px] mx-auto md:mx-0"
          />

          {/* Content */}
          <div className="text-center md:text-left space-y-4 flex flex-col justify-center items-center mt-3">
            <p className="text-gray-700 text-base xl:text-lg font-medium leading-relaxed text-center max-w-96">
              Become an affiliate and start earning with every user you refer. Enjoy quick approval
              and easy commission payouts.
            </p>

            <button
              onClick={() => {
                setOpen((prev) => !prev);
              }}
              className="bg-primary transition text-white px-6 py-1.5 font-semibold rounded-md shadow-solid-black"
            >
              BECOME AN AFFILIATE
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <section className="w-full py-1.5 max-w-6xl mx-auto">
      <h2 className="text-xl 2xl:text-3xl font-semibold text-black mb-2.5">Become an Affiliate</h2>

      {/* Card Section */}
      {displayContent()}

      <div className="hidden md:flex max-w-[500px] 2xl:max-w-[650px] mx-auto justify-center mt-6 2xl:mt-10">
        <img
          src="/images/affiliate/affiliate-benifts.svg"
          alt="Affiliate Benifits"
          className="w-full h-auto"
        />
      </div>

      <div className="md:hidden max-w-md mx-auto text-center mt-4">
        <h2 className="text-green-500 font-semibold text-[22px] mb-3">Affiliate Benefits</h2>

        <ul className="space-y-1.5 text-left mx-auto w-fit">
          {affiliateBenefits.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <img src={item.icon} alt={item.text} className="w-12 object-contain" />
              <span className="text-gray-700 font-medium text-13 ">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <ReasonFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={(text) => submitHandler(text)}
      />
    </section>
  );
};

export default AffiliateWelcome;
