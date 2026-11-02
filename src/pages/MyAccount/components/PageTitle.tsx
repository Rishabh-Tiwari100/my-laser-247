type Props = {
  title: string;
};

export default function PageTitle({ title }: Props) {
  return <div className="mb-[6px] text-[22px] font-bold text-black">{title}</div>;
}
