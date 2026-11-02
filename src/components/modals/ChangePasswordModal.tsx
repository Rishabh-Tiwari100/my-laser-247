'use client';
import React from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/utils';
import { Icons } from '@/utils/icons';
import ChangePassword from '@/pages/Auth/ChangePassword';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  setShowChangePasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  setShowChangePasswordModal,
}) => {
  if (!open) return null;

  // Render modal using portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className={cn(
          'relative bg-white/40 backdrop-blur-lg rounded-lg shadow-lg p-5 w-full max-w-md'
        )}
      >
        <button onClick={onClose} className="absolute right-3 top-3 p-1 rounded hover:bg-gray-100">
          <Icons.close className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl text-black font-bold">Change Password</h2>
          <ChangePassword setShowChangePasswordModal={setShowChangePasswordModal} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChangePasswordModal;
