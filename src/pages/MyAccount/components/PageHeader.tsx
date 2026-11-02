type Props = {
  title: string;
};

export default function PageHeader({ title }: Props) {
  return (
    <div className="px-[15px] pt-[10px] pb-[8px]">
      <h2 className="text-[24px] font-bold text-[#111]">{title}</h2>
    </div>
  );
}
