type Props = {
  title?: string;
  onClick?: () => void;
};

export default function ExportButton({ title = 'Export CSV', onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-[#2c7d2e] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#256827]"
    >
      {title}
    </button>
  );
}
