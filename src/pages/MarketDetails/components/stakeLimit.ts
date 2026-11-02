import { valueFormatter } from '@/utils';

export type StakeLimitValue = number | string | null | undefined;

export const formatStakeLimit = (value: StakeLimitValue) => {
  if (value === null || value === undefined || value === '') return '0';

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '0';

  return valueFormatter.format(numericValue);
};

export const formatStakeLimitRange = (min: StakeLimitValue, max: StakeLimitValue) =>
  `${formatStakeLimit(min)} - ${formatStakeLimit(max)}`;
