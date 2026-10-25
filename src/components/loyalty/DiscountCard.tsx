'use client';

import { LEVELS, NEXT_VISIT_TIERS, formatNumber, formatToman } from '@/lib/utils';
import DiscountTile from './DiscountTile';

interface Props {
  customer: any;
  onConvert?: () => void;
}

export default function DiscountCard({ customer, onConvert }: Props) {
  const level = LEVELS[customer.loyalty_level] || LEVELS[1];
  const nextTier = NEXT_VISIT_TIERS.find((t) => t.visits > customer.total_visits);
  const progress = nextTier ? Math.min((customer.total_visits / nextTier.visits) * 100, 100) : 100;

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 md:p-8 text-white shadow-2xl">
      <div className="flex justify-between items-start pb-4 border-b border-white/20">
        <div>
          <h3 className="text-2xl font-bold">{customer.full_name}</h3>
          <span className="text-sm opacity-90">{level.icon} {level.name}</span>
        </div>
        <div className="text-left text-sm space-y-1">
          <div>مراجعات: <b>{customer.total_visits}</b></div>
          <div>امتیاز: <b>{formatNumber(customer.total_points)}</b></div>
        </div>
      </div>

      {nextTier && (
        <div className="mt-5">
          <p className="text-sm mb-2">
            {nextTier.visits - customer.total_visits} مراجعه دیگر تا تخفیف {nextTier.percent}٪
          </p>
          <div className="h-3 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <DiscountTile emoji="🎁" title="تخفیف بعدی" value={`${nextTier ? nextTier.percent : 25}٪`} subtitle="خودکار اعمال می‌شود" />
        <DiscountTile emoji="🎂" title="تخفیف تولد" value="۲۰٪" subtitle="ماه تولد" />
        <DiscountTile emoji="🔗" title="معرفی دوستان" value="۱۰٪" subtitle={`کد: ${customer.referral_code}`} copyable />
      </div>

      <button onClick={onConvert} className="w-full mt-6 bg-accent text-gray-900 font-bold py-3 rounded-xl">
        💰 تبدیل ۱۰۰۰ امتیاز به {formatToman(500000)} اعتبار
      </button>
    </div>
  );
}