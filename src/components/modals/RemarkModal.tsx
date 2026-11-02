import React from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '@/utils/icons';

interface RemarkModalProps {
  message: string;
  onClose: () => void;
}

export default function RemarkModal({ message, onClose }: RemarkModalProps) {
  const modalUI = (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2147483647] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-[480px] w-full mx-4 rounded-md shadow-xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Remark</h2>

          <button className="p-1 hover:bg-gray-200 rounded-md transition" onClick={onClose}>
            <Icons.close className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-700 p-4 leading-relaxed text-center bg-primary/20 max-h-[300px] overflow-y-auto">
          {message || 'No Message'}
        </p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalUI, document.body);
}
