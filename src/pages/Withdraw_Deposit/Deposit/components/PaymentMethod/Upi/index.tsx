import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import type { BankAccount, DepositUpiAccount } from '@/types/account';
import {
  useDepositWithdrawRequestMutation,
  useGetDepositAccountsQuery,
} from '@/store/api/accountApi';
import EmptyState from '@/pages/Withdraw_Deposit/components/EmptyState';
import UpiAccountCard from './components/UpiAccountCard';
import UpiDepositForm from './components/UpiDepositForm';
import { useClipboard } from '@/hooks';
import { useCurrentUser } from '@/hooks';

type UpiMethodKey = 'phonepe' | 'paytm' | 'gpay';
type BankMethodKey = `bank:${string}`;
type MethodKey = UpiMethodKey | BankMethodKey;
type SelectedDepositAccount =
  | { type: 'upi'; account: DepositUpiAccount }
  | { type: 'bank'; account: BankAccount };

const upiMethodPriority: UpiMethodKey[] = ['phonepe', 'paytm', 'gpay'];

const upiMethodDetails: Record<UpiMethodKey, { icon: string; label: string }> = {
  phonepe: {
    icon: '/images/upi/phonepay.jpeg',
    label: 'PHONEPE',
  },
  paytm: {
    icon: '/images/upi/paytm.jpeg',
    label: 'PAYTM',
  },
  gpay: {
    icon: '/images/upi/gpay.jpg',
    label: 'GOOGLE PAY',
  },
};

const isBankMethod = (method: MethodKey): method is BankMethodKey => method.startsWith('bank:');

const getMethodDetails = (method: MethodKey) => {
  if (!isBankMethod(method)) return upiMethodDetails[method];

  const bankType = method.replace('bank:', '');
  const number = bankType.match(/\d+/)?.[0];

  return {
    icon: '/icons/bank.png',
    label: number ? `BANK ${number}` : 'BANK',
  };
};

const getMethodKey = (type: string): UpiMethodKey | null => {
  const normalizedType = String(type)
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, '');
  const typeNumber = normalizedType.match(/^(?:qr|type|upi)?([123])$/)?.[1];

  if (typeNumber === '1') return 'phonepe';
  if (typeNumber === '2') return 'paytm';
  if (typeNumber === '3') return 'gpay';
  return null;
};

const getAccountKey = (account: DepositUpiAccount, index: number) =>
  String(account.id ?? account.upiId ?? account.number ?? index);

const getBankAccountKey = (account: BankAccount, index: number) =>
  String(account.id ?? account.accountNumber ?? index);

const getBankMethodKey = (account: BankAccount): BankMethodKey => {
  const rawType = account.selectType?.trim() || 'Account1';
  const normalizedType = rawType.replace(/\s+/g, '').toLowerCase();
  return `bank:${normalizedType}`;
};

const getBankMinAmount = (account?: BankAccount) => Number(account?.minDepositAmount);

const getBankMaxAmount = (account?: BankAccount) => Number(account?.maxDepositAmount);

function BankAccountCard({
  active,
  account,
  onSelect,
}: {
  active: boolean;
  account: BankAccount;
  onSelect: () => void;
}) {
  const { copy } = useClipboard();

  const copyButton = (value: string, label: string) => (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        void copy(value);
      }}
      disabled={!value}
      className="flex items-center justify-center disabled:opacity-40"
      aria-label={`Copy ${label}`}
    >
      <FiCopy className="h-[16px] w-[16px]" />
    </button>
  );

  return (
    <article
      className={`relative min-h-[160px] min-w-[240px] flex-1 cursor-pointer overflow-hidden rounded-[4px] border bg-white sm:w-full${
        active ? 'border-[2px] border-[#0d3ead]' : 'border-[#c8c8c8]'
      }`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <header
        className={`flex h-[32px] items-center justify-between px-[7px] text-[13px] font-bold text-white ${
          active ? 'bg-[#123a9c]' : 'bg-[#557d9e]'
        }`}
      >
        <span className="truncate pr-2">{(account.bankName || 'BANK ACCOUNT').toUpperCase()}</span>
        {active && (
          <FiCheckCircle
            className="h-[20px] w-[20px] shrink-0 fill-[#7fc681] text-white"
            aria-label="Selected account"
          />
        )}
      </header>

      <div className="px-[9px] pt-[6px] text-[12px] sm:text-[15px]">
        <div className="grid grid-cols-[112px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[138px_minmax(0,1fr)_22px]">
          <span>Bank Name</span>
          <strong className="truncate" title={account.bankName || ''}>
            :&nbsp; {account.bankName || '-'}
          </strong>
          {copyButton(account.bankName || '', 'bank name')}
        </div>
        <div className="grid grid-cols-[112px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[138px_minmax(0,1fr)_22px]">
          <span>Account No.</span>
          <strong className="truncate" title={account.accountNumber}>
            :&nbsp; {account.accountNumber || '-'}
          </strong>
          {copyButton(account.accountNumber || '', 'account number')}
        </div>
        <div className="grid grid-cols-[112px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[138px_minmax(0,1fr)_22px]">
          <span>IFSC</span>
          <strong className="truncate" title={account.ifsc}>
            :&nbsp; {account.ifsc || '-'}
          </strong>
          {copyButton(account.ifsc || '', 'IFSC')}
        </div>
        <div className="grid grid-cols-[112px_minmax(0,1fr)_20px] items-center leading-[25px] sm:grid-cols-[138px_minmax(0,1fr)_22px]">
          <span>Holder Name</span>
          <strong className="truncate" title={account.accountHolder}>
            :&nbsp; {account.accountHolder || '-'}
          </strong>
          {copyButton(account.accountHolder || '', 'account holder')}
        </div>
      </div>
    </article>
  );
}

function Upi() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const amount = Number(searchParams.get('amount'));
  const [activeMethod, setActiveMethod] = useState<MethodKey>('phonepe');
  const [activeAccountKey, setActiveAccountKey] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const {
    data: depositAccounts,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useGetDepositAccountsQuery();
  const [createRequest, { isLoading: isSubmitting }] = useDepositWithdrawRequestMutation();
  const upiAccounts = depositAccounts?.Upi ?? depositAccounts?.upi ?? [];
  const bankAccounts =
    depositAccounts?.Bank ??
    depositAccounts?.Banks ??
    depositAccounts?.bank ??
    depositAccounts?.banks ??
    [];

  const accountsByMethod = useMemo(
    () =>
      upiAccounts.reduce<Record<UpiMethodKey, DepositUpiAccount[]>>(
        (groups, account) => {
          const method = getMethodKey(account.type);
          if (method) groups[method].push(account);
          return groups;
        },
        {
          phonepe: [],
          paytm: [],
          gpay: [],
        }
      ),
    [upiAccounts]
  );

  const bankAccountsByMethod = useMemo(
    () =>
      bankAccounts.reduce<Record<BankMethodKey, BankAccount[]>>(
        (groups, account) => {
          const method = getBankMethodKey(account);
          groups[method] = groups[method] ?? [];
          groups[method].push(account);
          return groups;
        },
        {} as Record<BankMethodKey, BankAccount[]>
      ),
    [bankAccounts]
  );

  const bankMethodPriority = useMemo(
    () =>
      Object.keys(bankAccountsByMethod).sort((left, right) => {
        const leftNumber = Number(left.match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);
        const rightNumber = Number(right.match(/\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);
        return leftNumber - rightNumber || left.localeCompare(right);
      }) as BankMethodKey[],
    [bankAccountsByMethod]
  );

  const methodPriority = useMemo<MethodKey[]>(
    () => [
      ...upiMethodPriority.filter((method) => accountsByMethod[method].length > 0),
      ...bankMethodPriority,
    ],
    [accountsByMethod, bankMethodPriority]
  );
  const activeUpiAccounts = isBankMethod(activeMethod) ? [] : accountsByMethod[activeMethod];
  const activeBankAccounts = isBankMethod(activeMethod)
    ? (bankAccountsByMethod[activeMethod] ?? [])
    : [];
  const activeAccounts = isBankMethod(activeMethod) ? activeBankAccounts : activeUpiAccounts;
  const activeMethodDetails = getMethodDetails(activeMethod);

  const selectMethod = useCallback(
    (method: MethodKey) => {
      setActiveMethod(method);
      const firstAccount = isBankMethod(method)
        ? bankAccountsByMethod[method]?.[0]
        : accountsByMethod[method][0];
      setActiveAccountKey(
        firstAccount
          ? isBankMethod(method)
            ? getBankAccountKey(firstAccount as BankAccount, 0)
            : getAccountKey(firstAccount as DepositUpiAccount, 0)
          : ''
      );
    },
    [accountsByMethod, bankAccountsByMethod]
  );

  useEffect(() => {
    if (methodPriority.length === 0) {
      setActiveAccountKey('');
      return;
    }

    const firstAvailableMethod = methodPriority[0];
    if (firstAvailableMethod && !methodPriority.includes(activeMethod)) {
      selectMethod(firstAvailableMethod);
    }
  }, [activeMethod, methodPriority, selectMethod]);

  useEffect(() => {
    const accountStillAvailable = isBankMethod(activeMethod)
      ? activeBankAccounts.some(
          (account, index) => getBankAccountKey(account, index) === activeAccountKey
        )
      : activeUpiAccounts.some(
          (account, index) => getAccountKey(account, index) === activeAccountKey
        );
    if (!accountStillAvailable) {
      const firstAccount = isBankMethod(activeMethod)
        ? activeBankAccounts[0]
        : activeUpiAccounts[0];
      setActiveAccountKey(
        firstAccount
          ? isBankMethod(activeMethod)
            ? getBankAccountKey(firstAccount as BankAccount, 0)
            : getAccountKey(firstAccount as DepositUpiAccount, 0)
          : ''
      );
    }
  }, [activeAccountKey, activeBankAccounts, activeMethod, activeUpiAccounts]);

  const selectedAccount: SelectedDepositAccount | undefined = (() => {
    if (isBankMethod(activeMethod)) {
      const account =
        activeBankAccounts.find(
          (bankAccount, index) => getBankAccountKey(bankAccount, index) === activeAccountKey
        ) ?? activeBankAccounts[0];

      return account ? { type: 'bank', account } : undefined;
    }

    const account =
      activeUpiAccounts.find(
        (upiAccount, index) => getAccountKey(upiAccount, index) === activeAccountKey
      ) ?? activeUpiAccounts[0];

    return account ? { type: 'upi', account } : undefined;
  })();

  const submitRequest = async ({
    paymentProof,
    utr,
    mfaCode,
  }: {
    paymentProof: string;
    utr: string;
    mfaCode?: string;
  }): Promise<boolean> => {
    const account = selectedAccount?.account;
    const accountId = account?.id;
    const min =
      selectedAccount?.type === 'bank'
        ? getBankMinAmount(selectedAccount.account)
        : Number(selectedAccount?.account.minAmount);
    const max =
      selectedAccount?.type === 'bank'
        ? getBankMaxAmount(selectedAccount.account)
        : Number(selectedAccount?.account.maxAmount);

    if (!selectedAccount || !account || !accountId) {
      toast.error('Please select a valid deposit account.', { id: 'upi-deposit' });
      return false;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Please enter a valid deposit amount.', {
        id: 'upi-deposit',
      });
      return false;
    }

    if (Number.isFinite(min) && min > 0 && amount < min) {
      toast.error(`The minimum deposit amount is ${min}.`, {
        id: 'upi-deposit',
      });
      return false;
    }

    if (Number.isFinite(max) && max > 0 && amount > max) {
      toast.error(`The maximum deposit amount is ${max}.`, {
        id: 'upi-deposit',
      });
      return false;
    }

    try {
      const response = await createRequest({
        method: selectedAccount.type,
        type: 'Credit',
        amount,
        ...(selectedAccount.type === 'bank'
          ? { bankId: Number(accountId) }
          : { UPI: Number(accountId) }),
        image: paymentProof,
        UTR: utr,
        ...(mfaCode
          ? {
              mfaCode,
              mfaOtp: mfaCode,
            }
          : {}),
      }).unwrap();
      toast.success(response?.message || 'Request Submitted Successfully', {
        id: 'upi-deposit',
      });
      setResetKey((value) => value + 1);
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to deposit money', {
        id: 'upi-deposit',
      });
      return false;
    }
  };

  const handleDepositFormSubmit = async (values: { paymentProof: string; utr: string }) => {
    await submitRequest(values);
  };

  return (
    <div className="w-full text-black">
      <button
        type="button"
        onClick={() => navigate('/deposit', { replace: true })}
        className="mb-[8px] flex h-[27px] items-center justify-center rounded-[3px] bg-[#243a48] px-[11px] text-[12px] font-bold text-white hover:bg-[#162c3a]"
      >
        ‹ BACK
      </button>

      <h1 className="flex h-[31px] items-center bg-[#202020] px-[5px] text-[14px] font-bold text-white">
        Choose a payment method
      </h1>

      {isAccountsLoading ? (
        <div className="mt-[6px] rounded-[8px] bg-white p-5 text-center text-[13px]">
          Loading deposit accounts...
        </div>
      ) : isAccountsError ? (
        <div className="mt-[6px] rounded-[8px] bg-white p-5 text-center text-[13px]">
          <p>Could not load deposit accounts.</p>
          <button
            type="button"
            onClick={() => refetchAccounts()}
            className="mt-2 font-bold text-[#0d3ead] underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div
            className="scrollbar-hide mt-[6px] overflow-x-auto rounded-[10px] bg-white p-[10px]"
            role="region"
            aria-label="UPI payment methods"
            tabIndex={0}
          >
            <div className="flex min-w-max gap-[5px] sm:gap-[7px]">
              {methodPriority.map((method) => {
                const details = getMethodDetails(method);
                const isActive = method === activeMethod;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => selectMethod(method)}
                    aria-pressed={isActive}
                    className={`flex h-[86px] w-[130px] shrink-0 flex-col items-center justify-center rounded-[11px] border text-[12px] transition-colors sm:w-[130px] ${
                      isActive
                        ? 'border-[#243a48] bg-[#638ca6] text-white'
                        : 'border-[#d1d1d1] bg-white text-black hover:bg-[#f4f7f9]'
                    }`}
                  >
                    <span>{details.label}</span>
                    <img
                      src={details.icon}
                      alt=""
                      className="mt-[4px] h-[27px] w-[35px] object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {activeAccounts.length === 0 ? (
            <div className="mt-[10px] rounded-[8px] bg-white p-5">
              <EmptyState />
            </div>
          ) : (
            <>
              <div
                className="scrollbar-hide mt-[10px] overflow-x-auto pb-[2px]"
                role="region"
                aria-label={`${activeMethodDetails.label} deposit accounts`}
                tabIndex={0}
              >
                <div className="flex min-w-max gap-[5px] sm:min-w-0 sm:flex-col sm:gap-[10px]">
                  {isBankMethod(activeMethod)
                    ? activeBankAccounts.map((account, index) => {
                        const accountKey = getBankAccountKey(account, index);
                        return (
                          <BankAccountCard
                            key={accountKey}
                            account={account}
                            active={accountKey === activeAccountKey}
                            onSelect={() => setActiveAccountKey(accountKey)}
                          />
                        );
                      })
                    : activeUpiAccounts.map((account, index) => {
                        const accountKey = getAccountKey(account, index);
                        return (
                          <UpiAccountCard
                            key={accountKey}
                            account={account}
                            active={accountKey === activeAccountKey}
                            onSelect={() => setActiveAccountKey(accountKey)}
                          />
                        );
                      })}
                </div>
              </div>

              {!isBankMethod(activeMethod) && (
                <aside className="mt-[8px] rounded-[5px] border border-[#d0d0d0] bg-white px-[8px] py-[14px] text-center text-[12px] font-bold leading-[24px] text-[#0c36a0]">
                  <p>HOW TO TRANSFER UPI TO BANK</p>
                  <a
                    href="https://www.upitobank.net"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    CLICK HERE WWW.UPITOBANK.NET
                  </a>
                </aside>
              )}

              <UpiDepositForm
                disabled={!selectedAccount?.account}
                isSubmitting={isSubmitting}
                resetKey={resetKey}
                onSubmit={handleDepositFormSubmit}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Upi;
