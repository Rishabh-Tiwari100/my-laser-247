import { marketRulesContent } from './market-rules-content';

export function getMarketRules(marketName: string, marketType = '') {
  const identity = `${marketName} ${marketType}`.toLowerCase();

  if (/book[\s_-]*maker/.test(identity)) return marketRulesContent.bookmaker;
  if (/fancy|session|khado|meter/.test(identity)) return marketRulesContent.fancy;
  return marketRulesContent.match;
}
