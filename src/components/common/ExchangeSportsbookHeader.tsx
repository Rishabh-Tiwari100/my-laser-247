import { useLocation } from 'react-router-dom';
import { cn } from '@/utils';

const ExchangeSportsbookHeader = () => {
  const isDashboard = useLocation().pathname === '/dashboard';
  return (
    <div className={isDashboard ? 'order-2' : undefined}>
      <ul className={cn('bg-gradient-to-b from-[#5f7fdb] to-[#0cddff] flex justify-center items-center py-[3px]', isDashboard && 'from-[#588ee2] to-[#00cce9]')}>
        <li><button className={cn('block bg-primary-theme border border-primary-theme text-sm text-white uppercase font-bold px-4 py-2 rounded-[10px] mx-[2px] shadow-[inset_0_0_0_1px_theme(colors.primary.theme)]', isDashboard && 'min-h-[37px] bg-[#213b49] border-[#213b49] px-[15px] py-[7px] max-lg:rounded-[7px]')}>Exchange</button></li>
        <li><button className={cn('block text-sm uppercase font-bold px-4 py-2 border border-primary-theme rounded-[10px] mx-[2px] shadow-[inset_0_0_0_1px_theme(colors.primary.theme)]', isDashboard && 'min-h-[37px] text-[#213b49] border-[#213b49] px-[15px] py-[7px] max-lg:rounded-[7px]')}>Sportsbook</button></li>
      </ul>
    </div>
  );
};

export default ExchangeSportsbookHeader;
