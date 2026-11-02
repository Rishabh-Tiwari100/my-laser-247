import React from 'react';

type Props = {
  label: string;
  value: React.ReactNode;
};

export default function InfoRow({ label, value }: Props) {
  return (
    <div className="grid grid-cols-[125px_1fr] border-b border-[#d6d6d6] last:border-b-0">
      <div className="px-[10px] h-[27px] flex items-center text-[13px] text-black">{label}</div>

      <div className="px-[10px] h-[27px] flex items-center text-[13px] text-black">{value}</div>
    </div>
  );
}
