import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddWithdrawalAccountModal from './components/AddWithdrawalAccountModal';
import WithdrawHeader from './components/common/WithdrawHeader';
import BankWithdrawForm from './components/Bank/components/BankWithdrawForm';
import UpiWithdrawForm from './components/Upi/components/UpiWithdrawForm';
import AccountInfoRow from './components/common/AccountInfoRow';
import DeleteAccountModal from './components/common/DeleteAccountModal';
import DepositWithdrawTransactions from '../components/DepositWithdrawTransactions';
import { useSelector } from 'react-redux';
import { cn, formatNumber } from '@/utils';
import { Icons } from '@/utils/icons';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store';
import TransactionPasswordModal from './components/TransactionPasswordModal';
import ForgotWithdrawPasswordModal from './components/ForgotWithdrawPasswordModal';
import {
  useDeleteAccountMutation,
  useGetActivePaymentGatewaysQuery,
  useGetBankAccountQuery,
  useGetUpiAccountQuery,
} from '@/store/api/accountApi';
import { withdrawRules } from './constants';
import type { BankAccount, UpiAccount } from '@/types/account';

type WithdrawalMethod = 'bank' | 'upi' | 'crypto';
type AccountModal = 'bank' | null;
type WithdrawAccount =
  | { type: 'bank'; id: string; account: BankAccount }
  | { type: 'upi'; id: string; account: UpiAccount };

const getAccountKey = (account: WithdrawAccount): string => `${account.type}-${account.id}`;

function Withdraw() {
  const [accountModal, setAccountModal] = useState<AccountModal>(null);
  const [transactionPasswordModalOpen, setTransactionPasswordModalOpen] = useState(true);
  const [forgotWithdrawPasswordModalOpen, setForgotWithdrawPasswordModalOpen] = useState(false);
  const [selectedAccountKey, setSelectedAccountKey] = useState<string | null>(null);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<WithdrawAccount | null>(null);
  const closeAccountModal = useCallback(() => setAccountModal(null), []);
  const closeTransactionPasswordModal = useCallback(
    () => setTransactionPasswordModalOpen(false),
    []
  );
  const closeForgotWithdrawPasswordModal = useCallback(
    () => setForgotWithdrawPasswordModalOpen(false),
    []
  );

  const balanceInfo = useSelector((state: RootState) => state.wallet);
  const { mainBalance, exposure, lockedAmount, withdrawableBalance } = balanceInfo;
  const { data: bankData, isFetching: isBankAccountsFetching } = useGetBankAccountQuery();
  const { data: upiData, isFetching: isUpiAccountsFetching } = useGetUpiAccountQuery();
  const { data: activeGatewaysResponse, isFetching: isGatewaysFetching } =
    useGetActivePaymentGatewaysQuery({ type: 'withdraw' });
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const bankAccounts = bankData?.banks ?? [];
  const upiAccounts = upiData?.upi ?? [];
  const withdrawalAccounts: WithdrawAccount[] = [
    ...bankAccounts.map((account) => ({ type: 'bank' as const, id: account.id, account })),
    ...upiAccounts.map((account) => ({ type: 'upi' as const, id: account.id, account })),
  ];
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const registeredMobile = userProfile?.mobile;
  const shouldShowTransactionPasswordModal =
    userProfile?.isWithdrawPasswordSet === false && transactionPasswordModalOpen;
  const navigate = useNavigate();
  const isAccountsFetching = isBankAccountsFetching || isUpiAccountsFetching;
  const activeGateways =
    activeGatewaysResponse?.data?.filter((gateway) => gateway.status === 'Active') ?? [];
  const hasActiveManualGateway = activeGateways.some((gateway) => gateway.type === 'Manual');
  const hasNoActiveGateway = !isGatewaysFetching && !hasActiveManualGateway;
  const hasWithdrawalAccounts = withdrawalAccounts.length > 0;
  const selectedAccount =
    withdrawalAccounts.find((account) => getAccountKey(account) === selectedAccountKey) ??
    withdrawalAccounts[0] ??
    null;
  const safeWithdrawableBalance = Number.isFinite(Number(withdrawableBalance))
    ? Number(withdrawableBalance)
    : 0;
  const fallbackAvailableBalance = Number(
    (
      Number(mainBalance || 0) -
      Math.abs(Number(exposure || 0)) -
      Math.abs(Number(lockedAmount || 0))
    ).toFixed(2)
  );
  const availableBalance =
    safeWithdrawableBalance > 0 ? safeWithdrawableBalance : fallbackAvailableBalance;
  const formattedWithdrawableBalance = formatNumber(Number(availableBalance.toFixed(2)));
  const handleAccountSaved = useCallback(
    (_method: WithdrawalMethod) => {
      closeAccountModal();
      setSelectedAccountKey(null);
    },
    [closeAccountModal]
  );
  const handleBack = useCallback(() => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    navigate('/', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (
      selectedAccountKey &&
      withdrawalAccounts.some((account) => getAccountKey(account) === selectedAccountKey)
    ) {
      return;
    }

    setSelectedAccountKey(withdrawalAccounts[0] ? getAccountKey(withdrawalAccounts[0]) : null);
  }, [selectedAccountKey, withdrawalAccounts]);

  const confirmDeleteAccount = async () => {
    if (!deleteAccountTarget) return;

    const toastOptions = { id: `delete-${getAccountKey(deleteAccountTarget)}` };
    try {
      const response = await deleteAccount({
        id: deleteAccountTarget.id,
        type: deleteAccountTarget.type,
      }).unwrap();
      toast.success(response.message || 'Account deleted successfully!', toastOptions);
      setDeleteAccountTarget(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete account!', toastOptions);
    }
  };

  return (
    <>
      <div
        className={`font-[Arial,Helvetica,sans-serif] md:min-h-[calc(100vh-151px)] ${
          hasWithdrawalAccounts && !hasNoActiveGateway
            ? 'px-2.5 py-4 md:px-6'
            : 'px-[3px] pb-[28px] pt-[9px] md:px-0'
        }`}
      >
        {hasNoActiveGateway && (
          <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
            <WithdrawHeader onBack={handleBack} onAddAccount={() => setAccountModal('bank')} />

            <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
              <p className="text-[13px] font-semibold">No active payment method is available.</p>
              <p className="mt-[4px] text-[12px] text-[#5f7183]">Please contact support.</p>
            </section>

            <DepositWithdrawTransactions
              ariaLabel="Withdrawal transactions"
              filterAriaLabel="Filter deposit and withdrawal transactions by status"
              sectionClassName="mt-[9px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[6px]"
              headingClassName="mb-[6px] text-[17px] font-bold leading-[19px]"
            />
          </main>
        )}

        {!hasNoActiveGateway && !isAccountsFetching && !hasWithdrawalAccounts && (
          <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
            <WithdrawHeader onBack={handleBack} onAddAccount={() => setAccountModal('bank')} />

            <section className="rounded-[5px] border border-[#999] bg-white p-[8px]">
              <h1 className="mb-[4px] text-[16px] font-normal leading-[18px]">
                Add Account To Withdraw...
              </h1>
              <ol className="list-decimal space-y-0 rounded-[5px] border border-[#999] py-[3px] pl-[22px] pr-[7px] text-[12px] leading-[19px] md:leading-[23px]">
                {withdrawRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>

              <button
                type="button"
                onClick={() => setForgotWithdrawPasswordModalOpen(true)}
                className="mt-[10px] h-[37px] w-full rounded-[4px] bg-[linear-gradient(90deg,#08003f_0%,#050660_45%,#08c6e9_100%)] text-[12px] text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf]"
              >
                Forgot Withdraw Password?
              </button>
            </section>

            <DepositWithdrawTransactions
              ariaLabel="Withdrawal transactions"
              filterAriaLabel="Filter deposit and withdrawal transactions by status"
              sectionClassName="mt-[9px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[6px]"
              headingClassName="mb-[6px] text-[17px] font-bold leading-[19px]"
            />
          </main>
        )}

        {!hasNoActiveGateway &&
          (isAccountsFetching || isGatewaysFetching || hasWithdrawalAccounts) && (
            <main className="mx-auto w-full max-w-[760px] text-[12px] text-black">
              <WithdrawHeader onBack={handleBack} onAddAccount={() => setAccountModal('bank')} />

              <section className="overflow-hidden rounded-[5px] border border-[#999] bg-white p-[10px]">
                {isAccountsFetching || isGatewaysFetching ? (
                  <div className="py-8 text-center text-sm">Loading withdrawal accounts...</div>
                ) : (
                  <>
                    <div className="flex gap-[10px] overflow-x-auto pb-[6px]">
                      {withdrawalAccounts.map((withdrawAccount) => {
                        const accountKey = getAccountKey(withdrawAccount);
                        const isSelected = selectedAccount
                          ? getAccountKey(selectedAccount) === accountKey
                          : false;
                        const cardWidthClass =
                          withdrawalAccounts.length === 1 ? 'w-full' : 'min-w-[85%]';

                        return (
                          <div
                            key={accountKey}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedAccountKey(accountKey)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedAccountKey(accountKey);
                              }
                            }}
                            aria-pressed={isSelected}
                            className={cn(
                              'relative flex-none cursor-pointer overflow-hidden rounded-[10px] border-2 bg-[#fbfbff] pr-[38px] text-left transition-colors',
                              cardWidthClass,
                              isSelected ? 'border-[#243a48]' : 'border-[#f3f2f6]'
                            )}
                          >
                            <span className="absolute left-0 top-0 z-10 rounded-br-[5px] bg-[#243a48] px-[8px] py-[4px] text-[10px] font-bold uppercase text-white">
                              {withdrawAccount.type}
                            </span>
                            <button
                              type="button"
                              disabled={isDeletingAccount}
                              onClick={(event) => {
                                event.stopPropagation();
                                setDeleteAccountTarget(withdrawAccount);
                              }}
                              aria-label={`Delete ${withdrawAccount.type} account`}
                              className="absolute right-0 top-0 z-10 flex h-[32px] w-[32px] items-center justify-center rounded-bl-[5px] bg-[#cf0000] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:brightness-95 disabled:opacity-60"
                            >
                              <Icons.delete className="h-[17px] w-[17px]" />
                            </button>

                            {withdrawAccount.type === 'bank' ? (
                              <div className="pt-[24px]">
                                <AccountInfoRow
                                  label="Bank Name"
                                  value={withdrawAccount.account.bankName || ''}
                                />
                                <AccountInfoRow
                                  label="Account Number"
                                  value={withdrawAccount.account.accountNumber}
                                />
                                <AccountInfoRow
                                  label="IFSC Code"
                                  value={withdrawAccount.account.ifsc}
                                />
                                <AccountInfoRow
                                  label="Account Holder Name"
                                  value={withdrawAccount.account.accountHolder}
                                />
                                {withdrawAccount.account.upiId && (
                                  <AccountInfoRow
                                    label="UPI ID"
                                    value={withdrawAccount.account.upiId}
                                  />
                                )}
                                {withdrawAccount.account.number && (
                                  <AccountInfoRow
                                    label="Mobile Number"
                                    value={withdrawAccount.account.number}
                                    copyable={false}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="pt-[24px]">
                                <AccountInfoRow
                                  label="Account Name"
                                  value={withdrawAccount.account.name || ''}
                                />
                                <AccountInfoRow
                                  label="UPI ID"
                                  value={withdrawAccount.account.upiId}
                                />
                                {withdrawAccount.account.number && (
                                  <AccountInfoRow
                                    label="Mobile Number"
                                    value={withdrawAccount.account.number}
                                    copyable={false}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {selectedAccount?.type === 'bank' && (
                      <BankWithdrawForm
                        account={selectedAccount.account}
                        availableBalance={formattedWithdrawableBalance}
                      />
                    )}
                    {selectedAccount?.type === 'upi' && (
                      <UpiWithdrawForm
                        account={selectedAccount.account}
                        availableBalance={formattedWithdrawableBalance}
                      />
                    )}
                  </>
                )}
              </section>

              <section className="mt-[9px] rounded-[5px] border border-[#999] bg-white p-[8px]">
                <ol className="list-decimal space-y-0 rounded-[5px] border border-[#999] py-[3px] pl-[22px] pr-[7px] text-[12px] leading-[19px] md:leading-[23px]">
                  {withdrawRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ol>

                <button
                  type="button"
                  onClick={() => setForgotWithdrawPasswordModalOpen(true)}
                  className="mt-[10px] h-[37px] w-full rounded-[4px] bg-[linear-gradient(90deg,#08003f_0%,#050660_45%,#08c6e9_100%)] text-[12px] text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf]"
                >
                  Forgot Withdraw Password?
                </button>
              </section>

              <DepositWithdrawTransactions
                ariaLabel="Withdrawal transactions"
                filterAriaLabel="Filter deposit and withdrawal transactions by status"
                sectionClassName="mt-[9px] overflow-hidden rounded-[5px] bg-white px-[8px] pb-[8px] pt-[6px]"
                headingClassName="mb-[6px] text-[17px] font-bold leading-[19px]"
              />
            </main>
          )}
      </div>

      <AddWithdrawalAccountModal
        key={accountModal}
        open={accountModal !== null}
        onClose={closeAccountModal}
        onSaved={handleAccountSaved}
      />
      <TransactionPasswordModal
        open={shouldShowTransactionPasswordModal}
        onClose={closeTransactionPasswordModal}
      />
      <ForgotWithdrawPasswordModal
        mobile={registeredMobile}
        open={forgotWithdrawPasswordModalOpen}
        onClose={closeForgotWithdrawPasswordModal}
      />
      <DeleteAccountModal
        open={deleteAccountTarget !== null}
        isDeleting={isDeletingAccount}
        onCancel={() => setDeleteAccountTarget(null)}
        onConfirm={confirmDeleteAccount}
      />
    </>
  );
}

export default Withdraw;
