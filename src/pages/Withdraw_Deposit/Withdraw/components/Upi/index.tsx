import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '@/pages/Withdraw_Deposit/components/EmptyState';
import type { UpiAccount } from '@/types/account';
import { Icons } from '@/utils/icons';
import { useDeleteAccountMutation } from '@/store/api/accountApi';
import AccountInfoRow from '../common/AccountInfoRow';
import DeleteAccountModal from '../common/DeleteAccountModal';
import UpiWithdrawForm from './components/UpiWithdrawForm';

interface UpiProps {
  accounts: UpiAccount[];
  isLoading: boolean;
  availableBalance: string;
}

function Upi({ accounts, isLoading, availableBalance }: UpiProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(accounts.length - 1, 0)));
  }, [accounts.length]);

  if (isLoading) {
    return <div className="py-8 text-center text-sm">Loading UPI accounts...</div>;
  }

  if (accounts.length === 0) return <EmptyState />;

  const selectedAccount = accounts[selectedIndex] ?? accounts[0]!;
  const accountToDelete = accounts.find((account) => account.id === deleteAccountId);

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    const toastOptions = { id: `delete-upi-${accountToDelete.id}` };
    try {
      const response = await deleteAccount({ id: accountToDelete.id, type: 'upi' }).unwrap();
      toast.success(response.message || 'UPI account deleted successfully!', toastOptions);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete UPI account!', toastOptions);
    } finally {
      setDeleteAccountId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[5px] border border-[#999] bg-white p-[10px]">
      <div className="flex gap-[10px] overflow-x-auto pb-[6px]">
        {accounts.map((account, index) => {
          const isSelected = selectedAccount.id === account.id;
          const cardWidthClass = accounts.length === 1 ? 'w-full' : 'min-w-[85%]';

          return (
            <div
              key={account.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedIndex(index);
                }
              }}
              aria-pressed={isSelected}
              className={`relative ${cardWidthClass} flex-none cursor-pointer overflow-hidden rounded-[10px] border-2 bg-[#fbfbff] pr-[38px] text-left transition-colors ${
                isSelected ? 'border-[#243a48]' : 'border-[#f3f2f6]'
              }`}
            >
              <button
                type="button"
                disabled={isDeleting}
                onClick={(event) => {
                  event.stopPropagation();
                  setDeleteAccountId(account.id);
                }}
                aria-label={`Delete UPI account ${index + 1}`}
                className="absolute right-0 top-0 z-10 flex h-[32px] w-[32px] items-center justify-center rounded-bl-[5px] bg-[#cf0000] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:brightness-95 disabled:opacity-60"
              >
                <Icons.delete className="h-[17px] w-[17px]" />
              </button>
              <AccountInfoRow label="Account Name" value={account.name || ''} />
              <AccountInfoRow label="UPI ID" value={account.upiId} />
              {account.number && (
                <AccountInfoRow label="Mobile Number" value={account.number} copyable={false} />
              )}
            </div>
          );
        })}
      </div>

      <UpiWithdrawForm account={selectedAccount} availableBalance={availableBalance} />

      <DeleteAccountModal
        open={deleteAccountId !== null}
        isDeleting={isDeleting}
        onCancel={() => setDeleteAccountId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default React.memo(Upi);
