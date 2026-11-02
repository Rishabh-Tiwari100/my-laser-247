import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function MobileNumberInput() {
  const [phone, setPhone] = useState('');

  return (
    <div className="w-full max-w-5xl rounded bg-gradient-to-r from-[#1B1464] via-[#153C99] to-[#00AEEF] p-[2px]">
      <div className="flex items-center bg-white rounded">
        <PhoneInput
          country={'in'}
          value={phone}
          onChange={setPhone}
          enableSearch
          placeholder="Enter Mobile Number*"
          buttonClass="!border-none !bg-white"
          containerClass="!w-full"
          inputClass="!w-full !h-10 !border-none !rounded-none !pl-20 !text-sm focus:!shadow-none"
          dropdownClass="!text-sm"
        />

        <button className="h-10 whitespace-nowrap bg-[#7B9BF4] px-5 text-sm font-medium text-white transition hover:bg-[#6788eb]">
          Get OTP
        </button>
      </div>
    </div>
  );
}
