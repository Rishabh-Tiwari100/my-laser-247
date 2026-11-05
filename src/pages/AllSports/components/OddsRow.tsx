import { useLocation } from 'react-router-dom';
import OddButton from '@/components/common/OddButton';
import clsx from 'clsx';
import OuterOddButton from './OuterOddButton';

type OddType = {
  price?: string | number | null;
  type: 'back' | 'lay';
};

interface Props {
  allOdds: OddType[];
  blockedStatus: string | null;
  length: number;
  isLeague?: boolean;
}

const OddsRow = ({ allOdds, blockedStatus, length, isLeague }: Props) => {
  const isDashboard = useLocation().pathname === '/dashboard';
  const groupedOdds: OddType[][] = [];

  for (let i = 0; i < allOdds.length; i += 2) {
    groupedOdds.push(allOdds.slice(i, i + 2));
  }

  return (
    <>
      {groupedOdds.map((group, groupIndex) => (
        <div key={groupIndex} className="grid grid-cols-2 gap-px w-full">
          {group.map((odd, index) => {
            const hasPrice = odd.price !== undefined && odd.price !== null && odd.price !== '';

            const isDisabled = Boolean(blockedStatus) || !hasPrice;
            return (
              <OuterOddButton
                key={`${odd.type}-${index}`}
                oddsCount={length}
                type={odd.type}
                context="outer"
                price={isDisabled ? null : odd.price}
                position={hasPrice ? 1 : 2}
                // className={clsx(isDisabled ? 'opacity-50' : 'opacity-100')}
                className={isDashboard ? odd.type === 'back' ? 'lg:h-[34px] lg:bg-[#72bbef]' : 'lg:h-[34px] lg:bg-[#faa9bd]' : undefined}
                isLeague={isLeague}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

export default OddsRow;
