const LABEL_PATTERNS: Array<{ key: 'utr' | 'transaction'; pattern: RegExp }> = [
  {
    key: 'utr',
    pattern:
      /\b(?:utr|utr\s*no|utr\s*number|upi\s*ref(?:\s*no)?|reference\s*no|reference\s*number|ref\s*no|ref\s*number)\s*[:#-]?\s*([a-z0-9][a-z0-9\s-]{5,40})/i,
  },
  {
    key: 'transaction',
    pattern:
      /\b(?:transaction\s*id|txn\s*id|txn\s*no|transaction\s*ref|reference\s*id|payment\s*id)\s*[:#-]?\s*([a-z0-9][a-z0-9\s-]{5,60})/i,
  },
];

const UTR_CONTEXT_PATTERNS = [
  /\b(?:utr|utr\s*no|utr\s*number|transaction\s*id|txn\s*id|txn\s*no|transaction\s*ref|reference\s*id|ref\s*no|upi\s*ref|upi\s*reference)\b/,
  /\b(?:transaction\s+successful|payment\s+details|debited\s+from|paid\s+to)\b.*\b(?:utr|transaction\s*id|txn\s*id|reference|ref)\b/,
];

const NOISE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/[\u00a0]/g, ' '],
  [/\bO\b/g, '0'],
  [/\bI\b/g, '1'],
  [/\bl\b/g, '1'],
];

const DIGIT_SEQUENCE_PATTERN = /[A-Z]?\d(?:[A-Z0-9\s-]{4,40}[A-Z0-9])?/gi;
const PREFERRED_UTR_PATTERN = /\b\d{12,22}\b/g;
const FALLBACK_UTR_PATTERN = /\b\d{6,22}\b/g;
const TRANSACTION_ID_PATTERN = /\b[A-Z0-9]{12,30}\b/g;

const normalizeText = (text: string) =>
  NOISE_REPLACEMENTS.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .replace(/[^\w\s]/g, ' ');

const normalizeCandidate = (value: string) => value.replace(/[\s-]/g, '');

const scoreCandidate = (text: string, start: number, length: number, hasContext: boolean) => {
  let score = 0;

  if (hasContext) score += 100;
  if (length >= 12) score += 30;
  if (length >= 18) score += 10;
  if (length === 12) score += 15;

  const before = text.slice(Math.max(0, start - 24), start).toLowerCase();
  const after = text.slice(start + length, start + length + 24).toLowerCase();

  if (/\b(?:utr|txn|transaction|reference|ref)\b/.test(before)) score += 40;
  if (/\b(?:utr|txn|transaction|reference|ref)\b/.test(after)) score += 20;
  if (/\b(?:amount|rs|inr|paid|wallet|balance|mobile|phone|account|ifsc|upi|invoice|order)\b/.test(before))
    score -= 20;

  return score;
};

const collectMatches = (text: string, pattern: RegExp) => {
  const matches: Array<{ value: string; index: number; length: number }> = [];
  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    matches.push({ value, index, length: value.length });
  }
  return matches;
};

const extractFromLabeledSegments = (text: string) => {
  const normalizedText = text.replace(/\r/g, '\n');
  const segments = normalizedText
    .split(/\n|[|•]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const candidates: Array<{ value: string; index: number; length: number; score: number }> = [];

  for (const segment of segments) {
    const contextMatched = UTR_CONTEXT_PATTERNS.some((pattern) => pattern.test(segment));
    const digitMatches = collectMatches(segment, PREFERRED_UTR_PATTERN);

    for (const match of digitMatches) {
      candidates.push({
        value: match.value,
        index: match.index,
        length: match.length,
        score: scoreCandidate(segment, match.index, match.length, contextMatched),
      });
    }
  }

  return candidates;
};

const extractFromFreeText = (text: string) => {
  const candidates: Array<{ value: string; index: number; length: number; score: number }> = [];

  for (const match of text.matchAll(DIGIT_SEQUENCE_PATTERN)) {
    const raw = match[0];
    const index = match.index ?? 0;
    const value = normalizeCandidate(raw);

    if (!/^\d{6,22}$/.test(value)) continue;

    candidates.push({
      value,
      index,
      length: value.length,
      score: scoreCandidate(text, index, value.length, false),
    });
  }

  return candidates;
};

const extractFallbackCandidates = (text: string) => {
  const candidates: Array<{ value: string; index: number; length: number; score: number }> = [];

  for (const match of text.matchAll(FALLBACK_UTR_PATTERN)) {
    const value = match[0];
    const index = match.index ?? 0;
    candidates.push({
      value,
      index,
      length: value.length,
      score: scoreCandidate(text, index, value.length, false) - 15,
    });
  }

  return candidates;
};

export const extractUtrFromText = (text: string) => {
  const source = normalizeText(text);
  for (const { key, pattern } of LABEL_PATTERNS) {
    const match = source.match(pattern);
    if (!match) continue;

    const value = normalizeCandidate(match[1] ?? '');
    if (key === 'utr' && /^\d{12,22}$/.test(value)) return value;
    if (key === 'transaction' && /^[A-Z0-9]{12,30}$/.test(value)) return value;
  }

  const labeledCandidates = extractFromLabeledSegments(source);
  const freeTextCandidates = extractFromFreeText(source);
  const fallbackCandidates = extractFallbackCandidates(source);
  const candidates = [...labeledCandidates, ...freeTextCandidates, ...fallbackCandidates];

  if (candidates.length === 0) return '';

  candidates.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.length !== left.length) return right.length - left.length;
    return left.index - right.index;
  });

  return candidates[0]?.value ?? '';
};

export const extractTransactionIdFromText = (text: string) => {
  const source = normalizeText(text);

  for (const { key, pattern } of LABEL_PATTERNS) {
    if (key !== 'transaction') continue;
    const match = source.match(pattern);
    if (!match) continue;

    const value = normalizeCandidate(match[1] ?? '');
    if (/^[A-Z0-9]{12,30}$/.test(value)) return value;
  }

  const matches = source.match(TRANSACTION_ID_PATTERN) ?? [];
  return matches[0] ?? '';
};
