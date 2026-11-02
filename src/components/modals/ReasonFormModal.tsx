import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface ReasonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasonFrom: string) => void;
}

const MAX_CHARS = 250;

export const ReasonFormModal: React.FC<ReasonFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason.trim());
    setReason('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    let cleaned = value.replace(/[^a-zA-Z0-9 ]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.trimStart();
    setReason(cleaned.slice(0, MAX_CHARS));
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Affiliate Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Textarea */}
        <div className="mb-3">
          <textarea
            value={reason}
            onChange={handleChange}
            maxLength={MAX_CHARS}
            rows={5}
            className="resize-none w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Enter your reason..."
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {reason.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="rounded-md px-4 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 bg-primary/90 hover:bg-primary"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
