import { X } from 'lucide-react';
import { sanitizeAlphaNumeric } from '@/utils';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] bg-black/30 flex items-center justify-center">
      <div className="w-[430px] bg-[#efefef] border border-[#777] shadow-lg rounded-md">
        {/* Header */}

        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-[16px] font-bold text-[#34495e]">Change Password</h3>

          <button onClick={onClose}>
            <div className="w-4 h-4 bg-black rounded-[2px] flex items-center justify-center font-bold">
              <X size={13} color="white" />
            </div>
          </button>
        </div>

        {/* Body */}

        <div className="px-8 pb-6">
          <div className="space-y-4">
            <Row label="New Password" />

            <Row label="New Password Confirm" />

            <Row label="Your Password" />
          </div>

          <div className="mt-8 flex justify-center">
            <button className="bg-[#f7a700] border border-[#c67b00] rounded px-6 py-[4px] text-[14px] font-bold text-black hover:bg-[#ffb300]">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr_10px] items-center gap-2">
      <label className="text-[13px] text-[#333] text-right">{label}</label>

      <input
        placeholder="Enter"
        type="password"
        onInput={(event) => {
          event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
        }}
        className="h-[26px] border border-t-[#000] px-2 text-[13px] bg-white outline-none rounded-md"
      />

      <span className="text-red-500">*</span>
    </div>
  );
}
