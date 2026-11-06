import { useState } from 'react';

export default function ApplyCoupon() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  return (
    <div className="pt-[3px] [font-family:Arial,Helvetica,sans-serif]">
      <h1 className="m-0 bg-[#243a48] px-[8px] py-[7px] text-[20px] font-bold leading-[25px] text-white">Bonus Coupon</h1>
      <section aria-labelledby="coupon-title" className="mx-auto mt-[10px] w-[476px] max-w-[calc(100%-16px)] rounded-[5px] bg-white px-[15px] py-[14px] text-black">
        <h2 id="coupon-title" className="mt-[9px] text-[16px] font-bold leading-[20px]">APPLY BONUS COUPON</h2>
        <p className="mb-[13px] mt-[5px] text-[11px] leading-[16px] text-[#455463]">Enter your coupon code and click Search to check availability and claim your bonus.</p>
        <form onSubmit={(event) => {
          event.preventDefault();
          setMessage(code.trim() ? 'Coupon search is currently unavailable. Please try again later.' : 'Enter your coupon code.');
        }}>
          <div className="flex h-[38px] rounded-[3px] shadow-[0_1px_4px_#0002]">
            <input aria-label="Coupon code" maxLength={50} autoComplete="off" value={code} onChange={(event) => { setCode(event.target.value); setMessage(''); }} placeholder="ENTER COUPON CODE" className="min-w-0 flex-1 rounded-l-[3px] border border-[#ccd2d8] bg-white px-[15px] text-[14px] text-black placeholder:text-[#a9b2bd] focus:outline-none focus:ring-1 focus:ring-[#243a48]" />
            <button type="submit" className="w-[89px] shrink-0 rounded-r-[3px] border border-[#5a839b] bg-[#243a48] text-[12px] font-bold text-white shadow-[1px_1px_3px_#0008] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00bfe9]">SEARCH</button>
          </div>
          {message && <p role="status" className="mt-3 text-[12px] text-[#b42318]">{message}</p>}
        </form>
      </section>
    </div>
  );
}
  