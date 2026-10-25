export function formatToman(amount: number | string): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('fa-IR').format(Math.round(n)) + ' تومان';
}

export function formatNumber(n: number | string): string {
  return new Intl.NumberFormat('fa-IR').format(Number(n));
}

export const LEVELS: Record<number, { name: string; icon: string }> = {
  1: { name: 'عادی',      icon: '⚪' },
  2: { name: 'نقره‌ای',   icon: '🥈' },
  3: { name: 'طلایی',     icon: '🥇' },
  4: { name: 'پلاتینیوم', icon: '💎' },
};

export const NEXT_VISIT_TIERS = [
  { visits: 2, percent: 5 },
  { visits: 3, percent: 10 },
  { visits: 4, percent: 15 },
  { visits: 5, percent: 20 },
  { visits: 6, percent: 25 },
];