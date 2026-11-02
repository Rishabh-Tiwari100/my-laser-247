type Props = {
  title: string;
};

export default function ReportHeader({ title }: Props) {
  return (
    <div className="border border-[#8b9cab]">
      <div className="bg-[#5d7284] text-white text-[15px] font-semibold px-4 py-2">{title}</div>
    </div>
  );
}
