export default function HomeFooter() {
  return (
    <footer className="bg-[#eee] pt-[13px] pb-[16px] font-helvetica lg:pt-4 lg:pb-1">
      <div className="mx-auto flex min-h-[142px] w-full max-w-[670px] flex-col items-center rounded-[6px] border border-black/30 bg-[#eee] px-[15px] text-[10px] leading-[14px] text-black lg:flex-row lg:rounded-[8px] lg:bg-[#f2f2f2] lg:px-[10px] lg:text-[11px]">
        <div className="flex shrink-0 flex-col justify-center lg:mr-[7px] lg:border-r lg:border-black/30 lg:pr-[7px]">
          <img className="mt-[13px] mb-[10px] h-auto w-[100px] max-w-full lg:my-5" src="/images/footer/gc.webp" alt="GC" />
        </div>
        <div className="shrink-0 lg:mr-[5px]">
          <img
            src="/images/footer/lice.webp"
            className="mb-[10px] h-auto w-[100px] max-w-full lg:my-5"
            alt="License"
          />
        </div>
        <p className="min-w-0 flex-1 text-center lg:pl-[5px] lg:text-left">
          Mylaser247live is the trading name of Sports Target B.V., a company incorporated and regulated
          in Cura&ccedil;ao under company number 148053 with its registered office at Fransche Bloemweg 4,
          Willemstad, Cura&ccedil;ao.
        </p>
      </div>
      <div>
        <p className="mt-3 hidden text-center text-[11px] leading-4 text-[#777] lg:block">
          Our website works best in the newest and last prior version of these browsers: Google
          Chrome. Firefox
        </p>
        <nav
          aria-label="Footer policies"
          className="mx-auto mt-1.5 flex max-w-[760px] flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-[11px] leading-4 text-black lg:gap-x-5 lg:border-t lg:border-black/30"
        >
          {['Privacy Policy', 'Terms and conditions', 'Rules and Regulations', 'About Us', 'Responsible Gaming'].map((label) => <button key={label} type="button" className="capitalize underline underline-offset-2">{label}</button>)}
        </nav>
      </div>
    </footer>
  );
}
