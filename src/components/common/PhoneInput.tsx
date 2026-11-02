import * as React from 'react';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type PhoneData = {
  countryCode: string;
  phoneNumber: string;
  country: string;
  fullNumber: string;
};

type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> & {
  value?: string;
  defaultCountry?: string;
  onChange?: (data: PhoneData) => void;
  disabled?: boolean;
};

function PhoneInput({
  className,
  onChange,
  value,
  defaultCountry = 'in',
  disabled,
  ...props
}: PhoneInputProps) {
  const handleChange = (
    phone: string,
    countryData?: { dialCode?: string; countryCode?: string }
  ) => {
    const normalizedNumber = phone.replace(/\D/g, '');
    const dialCode = countryData?.dialCode ? `+${countryData.dialCode}` : '';
    const country = countryData?.countryCode?.toUpperCase() || '';
    const fullNumber = phone.startsWith('+') ? phone : `${dialCode}${normalizedNumber}`;

    onChange?.({
      countryCode: dialCode,
      phoneNumber: normalizedNumber,
      country,
      fullNumber,
    });
  };

  return (
    <PhoneInputLib
      country={defaultCountry}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      containerClass="!w-full"
      inputClass={`!h-[46px] !w-full !rounded-[4px] !border-none !text-sm !shadow-none ${className ?? ''}`}
      buttonClass="!border-none !bg-white"
      dropdownClass="!text-sm"
      inputProps={{ ...props }}
    />
  );
}

export type { PhoneData };

export default PhoneInput;
