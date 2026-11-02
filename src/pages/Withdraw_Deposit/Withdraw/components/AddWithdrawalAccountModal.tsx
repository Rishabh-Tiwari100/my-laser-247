import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  useAddBankAccountMutation,
  useAddCryptoWalletMutation,
  useGetCryptoNetworksQuery,
  useUploadFileMutation,
} from '@/store/api/accountApi';
import OtpModal from '@/components/common/OtpModal';
import { sanitizeAlphaNumeric } from '@/utils';
import { useCurrentUser } from '@/hooks';

const withdrawPasswordSchema = z
  .string()
  .trim()
  .min(1, 'Enter the withdraw password')
  .regex(/^[a-zA-Z0-9]+$/, 'Withdraw Password can contain only letters and numbers');

const bankNameOptions = [
  'HDFC',
  'Indusind',
  'ICICI',
  'AXIS Bank',
  'Mezan Bank',
  'Allied Bank',
  'Habib Bank',
  'United Bank',
  'Alfallaha Bank',
  'Shamrao Vithal Co-operative Bank',
  'Easypaisa',
  'Raast',
  'Yes Bank',
  'AU Small Finance Bank',
  'Canara Bank',
  'IDFC First Bank Limited',
  'SBI',
  'Central Bank of India',
  'Bank of Baroda',
  'Bank of India',
  'Bank of Maharashtra',
  'Indian Bank',
  'Indian Overseas Bank',
  'Punjab and Sind Bank',
  'Punjab National Bank',
  'UCO Bank',
  'Union Bank of India',
  'Bandhan Bank',
  'CSB Bank',
  'City Union Bank',
  'DCB Bank',
  'Dhanlaxmi Bank',
  'Federal Bank',
  'Jammu & Kashmir Bank',
  'Karnataka Bank',
  'Karur Vysya Bank',
  'Kotak Mahindra Bank',
  'Nainital Bank',
  'RBL Bank',
  'South Indian Bank',
  'Tamilnad Mercantile Bank',
  'IDBI Bank',
  'Capital Small Finance Bank',
  'Equitas Small Finance Bank',
  'Suryoday Small Finance Bank',
  'Ujjivan Small Finance Bank',
  'Utkarsh Small Finance Bank',
  'ESAF Small Finance Bank',
  'Fincare Small Finance Bank',
  'Jana Small Finance Bank',
  'North East Small Finance Bank',
  'Shivalik Bank',
  'Unity Finance Bank',
  'India Post Payments Bank',
  'Fino Payments Bank',
  'Paytm Payments Bank',
  'Andhra Pragathi Grameena',
  'Chaitanya Godavari Grameena',
  'Saptagiri Grameena Bank',
  'Andhra Pradesh Grameena Vikas Bank',
  'Telangana Grameena Bank',
  'Arunachal Pradesh Rural Bank',
  'Uttar Bihar Gramin Bank',
  'Chhattisgarh Rajya Gramin Bank',
  'Saurashtra Gramin Bank',
  'Sarva Haryana Gramin Bank',
  'Himachal Pradesh Gramin Bank',
  'Ellaquai Dehati Bank',
  'J&K Grameen Bank',
  'Karnataka Vikas Grameena Bank',
  'Madhyanchal Gramin Bank',
  'Vidharbha Konkan Gramin Bank',
  'Maharashtra Gramin Bank',
  'Manipur Rural Bank',
  'Meghalaya Rural Bank',
  'Mizoram Rural Bank',
  'Nagaland Rural Bank',
  'Utkal Grameen Bank',
  'Odisha Gramya Bank',
  'Puduvai Bharathiar Grama Bank',
  'Baroda Rajasthan Kshetriya Gramin Bank',
  'Rajasthan Marudhara Gramin Bank',
  'Tripura Gramin Bank',
  'Uttarakhand Gramin Bank',
  'Bangiya Gramin Vikas Bank',
  'Paschim Banga Gramin Bank',
  'Uttarbanga Kshetriya Gramin Bank',
  'Kerala Gramin Bank',
  'Assam Gramin Vikash Bank',
  'Baroda Gujarat Gramin Bank',
  'Dakshin Bihar Gramin Bank',
  'Punjab Gramin Bank',
  'Jharkhand Rajya Gramin Bank',
  'Standard Chartered Bank',
  'DBS Bank',
  'Airtel Payment Bank',
  'The saraswat co-operative bank ltd',
  'The AGRASEN COOPERATE BANK',
  'Mahaveer Co-operative Bank',
  'Bharatpe',
  'Prime Commercial Bank',
  'Janata Sahakari Bank',
  'Jio Payments Bank',
  'NSDL Payments Bank',
  'Gayatri Co-Operative Urban Bank Ltd',
  'The Eenadu Co Op Urban Bank Ltd',
  'Coastal Bank',
  'Eco India',
  'Karnantaka Net Banking',
  'Karnantaka Email',
  'Other Bank',
  'Abhyudaya Cooperative Bank Ltd',
  'Hongkong and Shanghai Banking Corporation Limited',
  'PRIYADARSHANI NAGARI SAHAKARI BANK MYDT',
  'VIDARBHA MERCHANTS URBAN CO-OP BANK LTD',
  'TELANGANA STATE CO OPERATIVE APEX BANK LTD',
  'Rajarambapu sahakari bank',
  'The Gadchiroli District Central Co Op Bank',
  'Indian post payment bank',
  'Karnataka Bank Limited',
  'the Banaskantha District Central Co-op Bank Ltd',
  'Andhra Bank',
  'PRAGATI KRISHNA GRAMIN BANK',
  'Bharat co-operative Bank',
  'BARODA UP BANK',
  'TJSB Sahakari Bank Ltd',
  'Adarsh Bank',
  'The Bombay mercantile Coperative bank ltd',
  'The surat district co op bank Ltd',
  'Slice small finance bank',
  'state bank of india',
  'Thane district co operative bank',
  'Ahmedabad district co operative bank',
  'karnataka gramin bank',
  'THE VISAKHAPATNAM COOPERATIVE BANK LTD',
  'Tumkur Grain Merchants Co-operative Bank',
  'Mumbai Bank',
  'The Mehsana Urban Co-Oprative Bank',
  'THE KARNATAKA STATE CO-OPRATIVE APEX BANK LTD',
  'The Adarsh Co op Urban Bank ltd',
  'Andhra Pradesh Grameena Bank',
  'Kalupur commercial cooperative Bank',
  'BASSEIN C BANK',
  'Deogiri Bank',
  'Suco Souharda Sahakari bank ltd',
  'SVC CO-OPERATIVE Bank LTD',
  'Smriti Nagrik Sahakari Bank MYDT',
  'Surat people cooperative bank',
  'SUVARNAYUG SAHAKARI BANK LIMITED',
  'reserve bank of india',
  'Balotra Urban co Operative Bank',
  'Adilabad DCC Bank LTD',
  'THE KARIMNAGAR DIST CO-OPERATIVE CENTRAL BANK',
  'Ambajogai Peoples Co Op Bank Ltd',
  'AMBAJOGAI PEOPLES CO-OPBANK Ltd',
  'MAHESH COOPRATIVE BANK LIMITED',
  'NKGSB Bank',
  'APNA SAHAKARI BANK LTD',
  'GP PARSIK SAHAKARI BANK LTD',
  'Akola Janata Commercial Co-operative Bank Ltd',
  'Uttar pradesh gramin',
  'Akola District Central Co-operative Bank',
  'Sai baba sahakari bank',
  'Sarvodaya Bank',
  'Nanital bank',
  'DSB bank',
  'AMBARNATH JAI - HIND CO-OP BANK LTD',
  'Up Gramin Bank',
  'Cosmos Bank',
  'The Varachha Co-Op Bank Ltd',
  'IndusInd bank',
  'The Karad Urban CO-OPERATIVE BANK LTD',
  'ALLAHABAD BANK',
  'allahabad bank',
  'jio bank',
  'SBM Bank India',
  'Nagpur nagrik sahakar bank',
  'Indore Premier Co-op Bank Ltd',
];

const bankAccountSchema = z.object({
  bankName: z.string().trim().min(2, 'Enter the bank name'),
  accountHolder: z
    .string()
    .trim()
    .min(3, 'Enter the account holder name')
    .regex(/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/, 'Enter a valid account holder name'),
  accountNumber: z.string().regex(/^\d{6,20}$/, 'Account number must contain 6 to 20 digits'),
  ifsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'),
  accountType: z.enum(['Savings', 'Current'], {
    required_error: 'Select an account type',
  }),
  upiId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}$/, 'Enter a valid UPI ID, for example name@bank'),
  number: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  withdrawPassword: withdrawPasswordSchema,
});

type BankAccountForm = z.infer<typeof bankAccountSchema>;
type WithdrawalMethod = 'bank' | 'upi' | 'crypto';
type AccountType = 'bank-upi' | 'crypto';

interface AddWithdrawalAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (method: WithdrawalMethod) => void;
}

const focusableSelector = [
  'button:not([disabled])',
  'select:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function AddWithdrawalAccountModal({ open, onClose, onSaved }: AddWithdrawalAccountModalProps) {
  const [addBankAccount, { isLoading: isAddingBank }] = useAddBankAccountMutation();
  const [addCryptoWallet, { isLoading: isAddingCrypto }] = useAddCryptoWalletMutation();
  const [uploadFile, { isLoading: isUploadingQr }] = useUploadFileMutation();
  const { data: cryptoNetworks = [], isLoading: isCryptoNetworksLoading } =
    useGetCryptoNetworksQuery(undefined, { skip: !open });
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const user = useCurrentUser();
  const isMfaEnabled = user?.isMfaEnabled === true;
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<BankAccountForm | null>(null);
  const [isMfaSubmitting, setIsMfaSubmitting] = useState(false);
  const isSaving = isAddingBank || isMfaSubmitting || isAddingCrypto || isUploadingQr;
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [showBankPassword, setShowBankPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('bank-upi');
  const [walletAddress, setWalletAddress] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [qrImage, setQrImage] = useState<File | null>(null);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const bankForm = useForm<BankAccountForm>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      ifsc: '',
      accountType: 'Savings',
      upiId: '',
      number: '',
      withdrawPassword: '',
    },
  });
  const resetBankForm = bankForm.reset;
  const selectedBankName = bankForm.watch('bankName');
  const filteredBankOptions = useMemo(() => {
    const searchTerm = bankSearch.trim().toLowerCase();
    if (!searchTerm) return bankNameOptions;

    return bankNameOptions.filter((bankName) => bankName.toLowerCase().includes(searchTerm));
  }, [bankSearch]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (otpModalOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, open, otpModalOpen]);

  useEffect(() => {
    if (!open) {
      resetBankForm();
      setBankDropdownOpen(false);
      setBankSearch('');
      setShowBankPassword(false);
      setAccountType('bank-upi');
      setWalletAddress('');
      setNetworkId('');
      setQrImage(null);
      setOtpModalOpen(false);
      setPendingSubmission(null);
      setIsMfaSubmitting(false);
    }
  }, [open, resetBankForm]);

  useEffect(() => {
    if (!bankDropdownOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!bankDropdownRef.current?.contains(event.target as Node)) {
        setBankDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [bankDropdownOpen]);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 0);
  }, [open]);

  if (!open) return null;

  const submitBankAccountNow = async (values: BankAccountForm, mfaCode?: string) => {
    const toastOptions = { id: 'add-bank' };
    const response = await addBankAccount({
      accountNumber: values.accountNumber,
      ifsc: values.ifsc.trim().toUpperCase(),
      accountHolder: values.accountHolder.trim(),
      accountType: values.accountType,
      bankName: values.bankName.trim(),
      upiId: values.upiId.trim(),
      number: values.number,
      selectType: 'Account1',
      withdrawPassword: values.withdrawPassword.trim(),
      ...(mfaCode
        ? {
            mfaCode,
            mfaOtp: mfaCode,
          }
        : {}),
    }).unwrap();
    toast.success(response.message || 'Bank account added successfully!', toastOptions);
    bankForm.reset();
    onSaved('bank');
  };

  const submitBankAccount = async (values: BankAccountForm) => {
    setFormError(null);

    if (!isMfaEnabled) {
      try {
        await submitBankAccountNow(values);
      } catch (error: any) {
        setFormError(error?.data?.message || 'Failed to add bank account!');
      }
      return;
    }

    setPendingSubmission({ ...values });
    setOtpModalOpen(true);
  };

  const handleMfaSubmit = async (mfaCode: string) => {
    if (!pendingSubmission) return;
    setFormError(null);

    setIsMfaSubmitting(true);
    try {
      await submitBankAccountNow(pendingSubmission, mfaCode);
      setOtpModalOpen(false);
      setPendingSubmission(null);
    } catch (error: any) {
      setFormError(error?.data?.message || 'Failed to add bank account!');
    } finally {
      setIsMfaSubmitting(false);
    }
  };

  const handleMfaClose = () => {
    setOtpModalOpen(false);
    setPendingSubmission(null);
  };

  const submitCryptoWallet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!walletAddress.trim()) {
      setFormError('Wallet address is required');
      return;
    }

    if (cryptoNetworks.length > 0 && !networkId) {
      setFormError('Select a crypto network');
      return;
    }

    try {
      let uploadedQr: string | undefined;
      if (qrImage) {
        const uploadResponse = await uploadFile(qrImage).unwrap();
        uploadedQr = uploadResponse.url;
        if (!uploadedQr) throw new Error('QR image upload did not return a file URL');
      }

      const response = await addCryptoWallet({
        walletAddress: walletAddress.trim(),
        qrImage: uploadedQr,
        networkId: networkId || undefined,
      }).unwrap();

      toast.success(response.message || 'Crypto wallet added successfully!', {
        id: 'add-crypto-wallet',
      });
      setWalletAddress('');
      setNetworkId('');
      setQrImage(null);
      onSaved('crypto');
    } catch (error: any) {
      setFormError(error?.data?.message || error?.message || 'Failed to add crypto wallet!');
    }
  };

  const inputClassName =
    'h-[40px] w-full rounded-[4px] border border-[#aaa] px-[12px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]';
  const errorClassName = 'mt-0.5 text-[11px] text-red-600';
  const isCryptoSaving = isAddingCrypto || isUploadingQr;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000003] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-[498px] max-w-[calc(100vw-16px)] overflow-hidden rounded-[6px] bg-white font-[Arial,Helvetica,sans-serif] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <header className="flex h-[42px] items-center justify-between bg-[#243a48] px-[11px] text-white">
          <div className="flex items-center gap-2">
            <h2 id={titleId} className="text-[16px] font-bold leading-none">
              Add Account
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
            aria-label="Close add account dialog"
          >
            <X className="h-[19px] w-[19px]" />
          </button>
        </header>

        <div className="grid grid-cols-2 gap-[6px] px-[8px] pt-[8px] text-[13px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setAccountType('bank-upi');
              setFormError(null);
            }}
            className={`h-[34px] rounded-[4px] border transition ${
              accountType === 'bank-upi'
                ? 'border-[#243a48] bg-[#243a48] text-white'
                : 'border-[#aaa] bg-white text-[#243a48]'
            }`}
          >
            Bank / UPI
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType('crypto');
              setFormError(null);
            }}
            className={`h-[34px] rounded-[4px] border transition ${
              accountType === 'crypto'
                ? 'border-[#243a48] bg-[#243a48] text-white'
                : 'border-[#aaa] bg-white text-[#243a48]'
            }`}
          >
            Crypto
          </button>
        </div>

        {accountType === 'bank-upi' ? (
          <form onSubmit={bankForm.handleSubmit(submitBankAccount)} noValidate className="p-[8px]">
            <div className="space-y-[7px]">
              <div>
                <label htmlFor="withdraw-bank-name" className="mb-[4px] block text-[13px]">
                  Bank Name
                </label>
                <div ref={bankDropdownRef} className="relative">
                  <button
                    id="withdraw-bank-name"
                    type="button"
                    data-autofocus
                    aria-haspopup="listbox"
                    aria-expanded={bankDropdownOpen}
                    onClick={() => setBankDropdownOpen((current) => !current)}
                    className={`${inputClassName} flex items-center bg-white text-left ${
                      selectedBankName ? 'text-black' : 'text-[#111]'
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {selectedBankName || 'Select Bank Name'}
                    </span>
                  </button>

                  {bankDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[255px] overflow-y-auto rounded-[2px] border border-[#b9b9b9] bg-white p-[6px] shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
                      <input
                        type="search"
                        value={bankSearch}
                        onChange={(event) => setBankSearch(event.target.value)}
                        placeholder="Search Banks..."
                        className="mb-[6px] h-[51px] w-full rounded-[5px] border border-[#b8b8b8] px-[15px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
                      />
                      <div role="listbox" aria-labelledby="withdraw-bank-name">
                        {filteredBankOptions.map((bankName) => (
                          <button
                            key={bankName}
                            type="button"
                            role="option"
                            aria-selected={selectedBankName === bankName}
                            onClick={() => {
                              bankForm.setValue('bankName', bankName, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                              setBankDropdownOpen(false);
                              setBankSearch('');
                            }}
                            className={`block h-[45px] w-full border-b border-[#c8c8c8] px-[10px] text-left text-[13px] hover:bg-[#e9ecef] ${
                              selectedBankName === bankName ? 'bg-[#e9ecef]' : 'bg-white'
                            }`}
                          >
                            {bankName}
                          </button>
                        ))}
                        {filteredBankOptions.length === 0 && (
                          <p className="px-[10px] py-[12px] text-[13px] text-[#667080]">
                            No banks found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {bankForm.formState.errors.bankName && (
                  <p className={errorClassName}>{bankForm.formState.errors.bankName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="withdraw-holder-name" className="mb-[4px] block text-[13px]">
                  Account Holder's Name
                </label>
                <input
                  {...bankForm.register('accountHolder')}
                  id="withdraw-holder-name"
                  autoComplete="name"
                  placeholder="Enter Account Holder Name"
                  className={inputClassName}
                />
                {bankForm.formState.errors.accountHolder && (
                  <p className={errorClassName}>
                    {bankForm.formState.errors.accountHolder.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="withdraw-account-number" className="mb-[4px] block text-[13px]">
                  Account Number
                </label>
                <input
                  {...bankForm.register('accountNumber')}
                  id="withdraw-account-number"
                  inputMode="numeric"
                  maxLength={20}
                  placeholder="Enter Account Number"
                  onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replace(/\D+/g, '');
                  }}
                  className={inputClassName}
                />
                {bankForm.formState.errors.accountNumber && (
                  <p className={errorClassName}>
                    {bankForm.formState.errors.accountNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="withdraw-ifsc" className="mb-[4px] block text-[13px]">
                  IFSC Code
                </label>
                <input
                  {...bankForm.register('ifsc')}
                  id="withdraw-ifsc"
                  maxLength={11}
                  placeholder="Enter IFSC Code"
                  onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '');
                  }}
                  className={`${inputClassName} uppercase placeholder:normal-case`}
                />
                {bankForm.formState.errors.ifsc && (
                  <p className={errorClassName}>{bankForm.formState.errors.ifsc.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="withdraw-account-type" className="mb-[4px] block text-[13px]">
                  Account Type
                </label>
                <select
                  {...bankForm.register('accountType')}
                  id="withdraw-account-type"
                  className={`${inputClassName} bg-white`}
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>

              <div>
                <label htmlFor="withdraw-upi-id" className="mb-[4px] block text-[13px]">
                  UPI ID
                </label>
                <input
                  {...bankForm.register('upiId')}
                  id="withdraw-upi-id"
                  autoCapitalize="none"
                  autoComplete="off"
                  placeholder="name@bank"
                  className={inputClassName}
                />
                {bankForm.formState.errors.upiId && (
                  <p className={errorClassName}>{bankForm.formState.errors.upiId.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="withdraw-upi-mobile" className="mb-[4px] block text-[13px]">
                  Mobile Number
                </label>
                <input
                  {...bankForm.register('number')}
                  id="withdraw-upi-mobile"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit Mobile Number"
                  onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replace(/\D+/g, '');
                  }}
                  className={inputClassName}
                />
                {bankForm.formState.errors.number && (
                  <p className={errorClassName}>{bankForm.formState.errors.number.message}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="withdraw-bank-password" className="mb-[4px] block text-[13px]">
                Withdraw Password
              </label>
              <div className="relative">
                <input
                  {...bankForm.register('withdrawPassword')}
                  id="withdraw-bank-password"
                  type={showBankPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter Withdraw Password"
                  onInput={(event) => {
                    event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
                  }}
                  className={`${inputClassName} pr-[42px]`}
                />
                <button
                  type="button"
                  onClick={() => setShowBankPassword((current) => !current)}
                  className="absolute right-[8px] top-1/2 flex h-[28px] w-[28px] -translate-y-1/2 items-center justify-center text-[#243a48]"
                  aria-label={
                    showBankPassword ? 'Hide withdraw password' : 'Show withdraw password'
                  }
                >
                  {showBankPassword ? (
                    <EyeOff className="h-[20px] w-[20px]" />
                  ) : (
                    <Eye className="h-[20px] w-[20px]" />
                  )}
                </button>
              </div>
              {bankForm.formState.errors.withdrawPassword && (
                <p className={errorClassName}>
                  {bankForm.formState.errors.withdrawPassword.message}
                </p>
              )}
            </div>
            <div className="mt-[10px] grid grid-cols-2 gap-[5px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="h-[33px] rounded-[3px] border border-[#243a48] bg-white text-[14px] text-[#243a48]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="h-[33px] rounded-[3px] bg-[#243a48] text-[14px] text-white disabled:opacity-70"
              >
                {isAddingBank ? 'Saving...' : 'Save'}
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-[8px] rounded-[4px] border border-red-200 bg-red-50 px-[10px] py-[7px] text-[12px] leading-[16px] text-red-600"
              >
                {formError}
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={submitCryptoWallet} noValidate className="space-y-[9px] p-[8px]">
            <div>
              <label htmlFor="withdraw-crypto-wallet" className="mb-[4px] block text-[13px]">
                Wallet Address *
              </label>
              <input
                id="withdraw-crypto-wallet"
                data-autofocus
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                autoComplete="off"
                placeholder="Enter your USDT wallet address"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="withdraw-crypto-network" className="mb-[4px] block text-[13px]">
                Network{cryptoNetworks.length ? ' *' : ''}
              </label>
              <select
                id="withdraw-crypto-network"
                value={networkId}
                onChange={(event) => setNetworkId(event.target.value)}
                disabled={isCryptoNetworksLoading}
                className={`${inputClassName} bg-white`}
              >
                <option value="">
                  {isCryptoNetworksLoading ? 'Loading networks...' : 'Select network'}
                </option>
                {cryptoNetworks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.paymentOptions?.[0]?.displayName || network.name}
                    {network.name ? ` - ${network.name}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="withdraw-crypto-qr" className="mb-[4px] block text-[13px]">
                Wallet QR Code <span className="text-[#667080]">(optional)</span>
              </label>
              <input
                id="withdraw-crypto-qr"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setQrImage(event.target.files?.[0] ?? null)}
                className="block w-full rounded-[4px] border border-[#aaa] px-[10px] py-[8px] text-[13px] file:mr-[10px] file:rounded-[3px] file:border-0 file:bg-[#243a48] file:px-[10px] file:py-[5px] file:text-white"
              />
              {qrImage && (
                <p className="mt-[4px] truncate text-[11px] text-[#008055]">{qrImage.name}</p>
              )}
            </div>

            <div className="mt-[10px] grid grid-cols-2 gap-[5px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isCryptoSaving}
                className="h-[33px] rounded-[3px] border border-[#243a48] bg-white text-[14px] text-[#243a48]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCryptoSaving}
                className="h-[33px] rounded-[3px] bg-[#243a48] text-[14px] text-white disabled:opacity-70"
              >
                {isCryptoSaving ? 'Saving...' : 'Save Wallet'}
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-[8px] rounded-[4px] border border-red-200 bg-red-50 px-[10px] py-[7px] text-[12px] leading-[16px] text-red-600"
              >
                {formError}
              </div>
            )}
          </form>
        )}
      </section>
      <OtpModal
        isOpen={otpModalOpen}
        onClose={handleMfaClose}
        onSubmit={handleMfaSubmit}
        isLoading={isMfaSubmitting}
        title="Enter MFA OTP"
        description="Enter the 6-digit MFA code to save this withdrawal account."
        submitLabel="Submit"
      />
    </div>,
    document.body
  );
}

export default AddWithdrawalAccountModal;
