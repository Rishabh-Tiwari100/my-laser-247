type Props = {
  title: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export default function PrimaryButton({ title, onClick, type = 'button' }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded bg-[#d58a22] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#bf791d]"
    >
      {title}
    </button>
  );
}
