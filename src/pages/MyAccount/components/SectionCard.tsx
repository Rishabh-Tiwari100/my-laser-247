import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function SectionCard({ title, children }: Props) {
  return (
    <div className="border border-[#bcc6cf] bg-white">
      <div className="h-[24px] bg-[#7d95a6] px-[10px] flex items-center text-[14px] font-bold text-white">
        {title}
      </div>

      {children}
    </div>
  );
}
