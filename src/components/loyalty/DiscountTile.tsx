'use client';

interface Props {
  emoji: string;
  title: string;
  value: string;
  subtitle: string;
  copyable?: boolean;
}

export default function DiscountTile({ emoji, title, value, subtitle, copyable }: Props) {
  const copy = () => {
    const code = subtitle.replace('کد: ', '');
    navigator.clipboard.writeText(code);
    alert('کد کپی شد: ' + code);
  };
  return (
    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
      <div className="text-3xl">{emoji}</div>
      <h4 className="text-sm mt-2">{title}</h4>
      <div className="text-3xl font-extrabold text-accent my-1">{value}</div>
      <p className="text-xs opacity-80">{subtitle}</p>
      {copyable && (
        <button onClick={copy} className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">
          کپی کد
        </button>
      )}
    </div>
  );
}