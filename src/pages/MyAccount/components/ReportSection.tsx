import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function ReportSection({ title, children }: Props) {
  return (
    <div className="border border-[#8ea2b5] bg-white">
      <div className="bg-[#d9e1e7] border-b border-[#8ea2b5] px-3 py-2 font-semibold text-[13px] text-[#243646]">
        {title}
      </div>

      {children}
    </div>
  );
}
