import type { Ref } from 'react';
import type { Country } from 'react-phone-number-input';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import countryLabelsJson from 'react-phone-number-input/locale/en.json';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/utils';

const countries = getCountries();
const countryLabels = countryLabelsJson as Record<string, string>;

export interface PhoneCountry {
  code: Country;
  dialCode: string;
}

interface AuthPhoneNumberInputProps {
  value?: string;
  country: PhoneCountry;
  onChange: (fullNumber: string) => void;
  onCountryChange: (country: PhoneCountry) => void;
  onBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

export default function AuthPhoneNumberInput({
  value,
  country,
  onChange,
  onCountryChange,
  onBlur,
  inputRef,
  name,
  placeholder = 'Enter Mobile Number*',
  autoComplete = 'tel-national',
  disabled = false,
  className,
}: AuthPhoneNumberInputProps) {
  const fullNumber = String(value ?? '').replace(/\D/g, '');
  const localNumber = fullNumber.startsWith(country.dialCode)
    ? fullNumber.slice(country.dialCode.length)
    : fullNumber;
  const maxLocalLength = 15 - country.dialCode.length;

  const updateLocalNumber = (digits: string) => {
    const nextLocalNumber = digits.replace(/\D/g, '').slice(0, maxLocalLength);
    onChange(nextLocalNumber ? `${country.dialCode}${nextLocalNumber}` : '');
  };

  return (
    <div
      className={cn(
        'react-tel-input flex h-10 w-full overflow-hidden rounded-[5px] bg-white text-[#111827] shadow-sm',
        disabled && 'bg-[#c9c9c9]',
        className
      )}
    >
      <div
        style={{ width: `${86 + Math.max(0, country.dialCode.length - 2) * 7}px` }}
        className="relative flex h-full shrink-0 items-center pl-[7px]"
      >
        <span className="flex h-[14px] w-[20px] items-center overflow-hidden">
          <span
            role="img"
            aria-label={countryLabels[country.code] ?? country.code}
            className={`flag ${country.code.toLowerCase()}`}
          />
        </span>
        <span className="ml-[7px] whitespace-nowrap text-sm">+{country.dialCode}</span>
        <span className="ml-[9px] h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#111827]" />

        <select
          aria-label="Country calling code"
          value={country.code}
          disabled={disabled}
          onChange={(event) => {
            const code = event.target.value as Country;
            const dialCode = getCountryCallingCode(code);
            const nextLocalNumber = localNumber.slice(0, 15 - dialCode.length);

            onCountryChange({ code, dialCode });
            onChange(nextLocalNumber ? `${dialCode}${nextLocalNumber}` : '');
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        >
          {countries.map((countryCode) => (
            <option key={countryCode} value={countryCode}>
              {countryLabels[countryCode] ?? countryCode} (+{getCountryCallingCode(countryCode)})
            </option>
          ))}
        </select>
      </div>

      <input
        ref={inputRef}
        name={name}
        value={localNumber}
        disabled={disabled}
        onChange={(event) => updateLocalNumber(event.target.value)}
        onPaste={(event) => {
          const pastedText = event.clipboardData.getData('text').trim();
          const pastedDigits = pastedText.replace(/\D/g, '');
          const localDigits = pastedText.startsWith('+')
            ? pastedDigits.replace(new RegExp(`^${country.dialCode}`), '')
            : pastedDigits;

          event.preventDefault();
          updateLocalNumber(localDigits);
        }}
        onBlur={onBlur}
        type="tel"
        inputMode="numeric"
        autoComplete={autoComplete}
        maxLength={maxLocalLength}
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 border-0 bg-white px-0 pr-3 text-sm font-normal text-[#111827] outline-none placeholder:text-[#111827] disabled:cursor-not-allowed disabled:bg-[#c9c9c9]"
      />
    </div>
  );
}
