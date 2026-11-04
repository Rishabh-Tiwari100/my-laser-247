import PrivacyPolicyModal from './modals/PrivacyPolicyModal';
import TAndCModal from './modals/TAndCModal';
import RulesAndRegulationsModal from './modals/RulesAndRegulationsModal';
import AboutUsModal from './modals/AboutUsModal';
import ResponsibleGamingModal from './modals/ResponsibleGamingModal';

export default function HomeFooter() {
  return (
    <footer className="pt-4 font-helvetica lg:pb-1">
      <div className="mx-auto flex min-h-[142px] w-full max-w-[670px] items-center rounded-[8px] border border-black/30 bg-white px-[10px] text-[11px] leading-[14px] text-black lg:bg-[#f2f2f2]">
        <div className="mr-[7px] flex shrink-0 flex-col justify-center border-r border-black/30 pr-[7px]">
          <img className="my-5 h-auto w-[100px] max-w-full" src="/images/footer/gc.webp" alt="GC" />
        </div>
        <div className="mr-[5px] shrink-0">
          <img
            src="/images/footer/lice.webp"
            className="my-5 h-auto w-[100px] max-w-full"
            alt="License"
          />
        </div>
        <p className="min-w-0 flex-1 pl-[5px] text-left">
          laser247 is the trading name of Sports Target B.V., a company incorporated and regulated
          in Curaçao under company number 148053 with it's registered office at Fransche Bloemweg 4,
          Willemstad, Curaçao.
        </p>
      </div>
      <div className="hidden lg:block">
        <p className="mt-3 text-center text-[11px] leading-4 text-[#777]">
          Our website works best in the newest and last prior version of these browsers: Google
          Chrome. Firefox
        </p>
        <nav
          aria-label="Footer policies"
          className="mx-auto mt-1.5 flex max-w-[760px] flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-black/30 pt-2 text-[11px] leading-4 text-black [&_button]:capitalize [&_button]:text-black [&_button]:focus-visible:outline [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-blue-500"
        >
          <PrivacyPolicyModal />
          <TAndCModal />
          <RulesAndRegulationsModal />
          <AboutUsModal />
          <ResponsibleGamingModal />
        </nav>
      </div>
    </footer>
  );
}
