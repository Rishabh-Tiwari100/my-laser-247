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
