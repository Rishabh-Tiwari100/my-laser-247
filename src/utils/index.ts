import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return Promise.resolve(true);
    } catch (error) {
      textArea.remove();
      return Promise.resolve(false);
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function parseJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

// export const formatMatchDate = (d: string) => new Intl.DateTimeFormat('en-GB').format(new Date(d));

// export const formatMatchTime = (d: string) =>
//   new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(d));

export const valueFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

export function formatMatchTime(matchDate: string | Date): string {
  const now = dayjs();
  const matchTime = dayjs(matchDate);

  const diffMinutes = matchTime.diff(now, 'minute');
  const diffHours = matchTime.diff(now, 'hour');

  // Case 1: Match starts within 2 hours
  if (diffMinutes > 0 && diffMinutes <= 120) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours > 0) {
      return `Starts in ${hours} hr ${minutes} min`;
    } else {
      return `Starts in ${minutes} min`;
    }
  }

  // Case 2: Match is today but after 2 hours
  if (matchTime.isSame(now, 'day')) {
    return `Starts at ${matchTime.format('HH:mm')}`;
  }

  // Case 3: Match on a future date
  return `Starts at ${matchTime.format('DD MMM HH:mm')}`;
}

export const formatNumber = (
  num: number | string | null | undefined,
  locale: string = 'en-US'
): string => {
  if (num == null || isNaN(Number(num))) return '-';
  const safeNumber = Number(num) || 0;

  // Fix to decimal places
  const fixedNumber = safeNumber.toFixed(2);

  // Convert back to float for comma formatting
  const numericValue = parseFloat(fixedNumber);
  return Number(num).toLocaleString(locale);
};

export const getPlatform = (): 'Mobile' | 'Desktop' => {
  if (typeof window === 'undefined') return 'Desktop';

  const userAgent = navigator.userAgent.toLowerCase();

  const isMobile = /iphone|ipad|ipod|android|blackberry|opera mini|iemobile|mobile/i.test(
    userAgent
  );

  return isMobile ? 'Mobile' : 'Desktop';
};

export const formatLabel = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const isBlank = (val: any) =>
  val == null ||
  (typeof val === 'string' && val.trim() === '') ||
  (Array.isArray(val) && val.length === 0) ||
  (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0);

export const applyInputRules = (
  value: string,
  rules?: {
    onlyNumber?: boolean;
    onlyAlphaNumeric?: boolean;
    onlyLowerCase?: boolean;
    onlyAlphabet?: boolean;
    noSpace?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
  }
) => {
  if (!rules) return value;

  let allowedChars = '';

  if (rules.pattern) {
    const match = rules.pattern.source.match(/\[([^\]]+)\]/);
    if (match?.[1]) {
      allowedChars = match[1];
    }
  }

  if (!allowedChars) {
    if (rules.onlyNumber) allowedChars = '0-9';
    else if (rules.onlyAlphaNumeric) allowedChars = 'a-zA-Z0-9';
    else if (rules.onlyLowerCase) allowedChars = 'a-z';
    else if (rules.onlyAlphabet) allowedChars = 'a-zA-Z';
    else {
      return applyPostProcessing(value, rules);
    }
  }

  if (!rules.noSpace) allowedChars += ' ';

  const regex = new RegExp(`[^${allowedChars}]`, 'g');
  value = value.replace(regex, '');

  return applyPostProcessing(value, rules);
};

export const sanitizeAlphaNumeric = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

const applyPostProcessing = (value: string, rules: any) => {
  if (rules.maxLength && value.length > rules.maxLength) {
    value = value.slice(0, rules.maxLength);
  }

  return value;
};

export const formatContextLabel = (value?: string) => {
  if (!value) return '--';

  if (!/[A-Z]/.test(value.slice(1))) {
    return value;
  }

  return value.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
};

// export const getBlockedStatus = (status?: string, marketStatus?: string): string | null => {
//   const blockedStatuses = ['ball running', 'ballrunning', 'suspended', 'closed', 'inactive'];

//   const runnerStatus = status?.toLowerCase();
//   const mStatus = marketStatus?.toLowerCase();

//   if (runnerStatus && blockedStatuses.includes(runnerStatus)) {
//     return runnerStatus;
//   }

//   if (mStatus && blockedStatuses.includes(mStatus)) {
//     return mStatus;
//   }

//   return null;
// };

export const getBlockedStatus = (status?: string, marketStatus?: string): string | null => {
  const runner = status?.toUpperCase();
  const market = marketStatus?.toUpperCase();

  const valid = ['OPEN', 'ACTIVE', ''];

  const isRunnerActive = valid.includes(runner ?? '');
  const isMarketActive = valid.includes(market ?? '');

  if (isRunnerActive && isMarketActive) return null;

  if (!isRunnerActive && !isMarketActive) return runner ?? null;

  if (!isRunnerActive) return runner ?? null;

  return market ?? null;
};
