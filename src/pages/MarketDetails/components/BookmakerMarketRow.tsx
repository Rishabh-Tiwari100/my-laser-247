import type { ComponentProps } from 'react';
import NormalMarketRow from './NormalMarketRow';

export default function BookmakerMarketRow(props: ComponentProps<typeof NormalMarketRow>) {
  return <NormalMarketRow {...props} />;
}
