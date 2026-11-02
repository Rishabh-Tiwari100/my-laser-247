import { FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { useReferral } from './hooks/useReferral';

const shareOptions = [
  {
    label: 'Facebook',
    icon: FaFacebookF,
    className: 'bg-[#1877f2]',
    url: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    label: 'Instagram',
    icon: FaInstagram,
    className:
      'bg-[radial-gradient(circle_at_30%_110%,#ffdc80_0%,#fcaf45_25%,#f77737_45%,#c13584_65%,#833ab4_85%,#405de6_100%)]',
    url: () => 'https://www.instagram.com/',
  },
  {
    label: 'WhatsApp',
    icon: FaWhatsapp,
    className: 'bg-[#20c96b]',
    url: (link: string) =>
      `https://wa.me/?text=${encodeURIComponent(`Join Laser247 with my referral link: ${link}`)}`,
  },
  {
    label: 'Telegram',
    icon: FaTelegramPlane,
    className: 'bg-[#229ed9]',
    url: (link: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join Laser247 with my referral link')}`,
  },
];

export default function Referral() {
  const { copy, referralCode, referralLink } = useReferral();
  const code = referralCode ?? '';

  const share = (getUrl: (link: string) => string) => {
    if (!referralLink) return;
    window.open(getUrl(referralLink), '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="pb-3 pt-0 text-[13px] text-white">
      <section className="px-4 pb-[10px] pt-[12px] sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1296px]">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-[76px] w-[78px]" aria-hidden="true">
              <img src="/icons/gift-box.svg" alt="" className='w-[77px] h-auto max-w-full align-middle' />
            </div>
            <h1 className="mt-1 text-[17px] font-bold leading-5">Refer And Rewards.</h1>
            <p className="text-[13px] leading-5">Copy your code, share it with your friends.</p>
          </div>

          <div className="mt-[14px]">
            <label className="mb-1 block font-bold">Your Referral Code:</label>
            <div className="flex min-h-[53px] items-center border-2 border-dashed border-[#233c4c] bg-[] pl-[10px]">
              <span className="min-w-0 flex-1 truncate text-[14px]">{code || '--'}</span>
              <button
                type="button"
                onClick={() => copy(code)}
                disabled={!code}
                className="mr-[10px] h-[36px] rounded-[4px] bg-[#213b4b] px-[15px] text-[14px] text-white hover:bg-[#162d3b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-[17px] flex items-end justify-between gap-4">
            <p className="pb-[12px] font-bold">Share This Link Via</p>
            <div className="flex items-center gap-[8px]">
              {shareOptions.map(({ label, icon: Icon, className, url }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => share(url)}
                  disabled={!referralLink}
                  aria-label={`Share on ${label}`}
                  title={`Share on ${label}`}
                  className={`flex h-[41px] w-[41px] items-center justify-center rounded-[9px] text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
                >
                  <Icon className="h-[25px] w-[25px]" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-[5px]">
            <label className="mb-[3px] block font-bold">Refer Link</label>
            <div className="flex h-[44px] overflow-hidden rounded-[3px] border border-[#ccd3d8] bg-[#e9ecef]">
              <input
                readOnly
                value={referralLink}
                aria-label="Referral link"
                className="min-w-0 flex-1 bg-transparent px-[11px] text-[14px] font-semibold text-[#172b38] outline-none"
              />
              <button
                type="button"
                onClick={() => copy(referralLink)}
                disabled={!referralLink}
                className="w-[73px] shrink-0 bg-[#213b4b] text-[14px] text-white hover:bg-[#162d3b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[10px] px-4 py-[7px] sm:px-8 lg:px-12">
        <p className="mx-auto max-w-[1296px] text-[12px]">
          <strong>Note :</strong> Referral apply on every wallet deposit Maximum bonus you can
          receive for Referral Bonus is.
        </p>
      </div>
    </main>
  );
}
