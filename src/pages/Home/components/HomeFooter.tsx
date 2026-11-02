import React, { useEffect, useState } from 'react';
import TAndCModal from './modals/TAndCModal';
import PrivacyPolicyModal from './modals/PrivacyPolicyModal';
import RulesAndRegulationsModal from './modals/RulesAndRegulationsModal';
import KycModal from './modals/KycModal';
import ResponsibleGamingModal from './modals/ResponsibleGamingModal';
// import AboutUsModal from './modals/AboutUsModal';
// import SelfExecutionModal from './modals/SelfExecutionModal';
// import UnderagePolicyModal from './modals/UnderagePolicyModal';
import { FaChrome, FaFirefoxBrowser } from 'react-icons/fa';
import { RiFacebookCircleFill, RiInstagramFill, RiWhatsappFill } from 'react-icons/ri';

const HomeFooter = () => {
  const [activeSocial, setActiveSocial] = useState(0);

  const iconRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [arrowLeft, setArrowLeft] = React.useState(0);

  const socialLinks = [
    {
      icon: <RiWhatsappFill />,
      content: (
        <>
          <a href="tel:+971569450904" className="underline">
            +971569450904
          </a>
          <span className="mx-2">|</span>
          <a href="tel:+971569753184" className="underline">
            +971569753184
          </a>
        </>
      ),
      href: 'https://wa.me/971569450904',
    },
    {
      icon: <RiFacebookCircleFill />,
      content: (
        <a
          href="https://facebook.com/ninewickets"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          ninewickets
        </a>
      ),
      href: 'https://facebook.com/ninewickets',
    },
    {
      icon: <RiInstagramFill />,
      content: (
        <a
          href="https://instagram.com/ninewickets"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          @ninewickets
        </a>
      ),
      href: 'https://instagram.com/ninewickets',
    },
  ];

  const FooterLinks = [
    { Modal: <PrivacyPolicyModal /> },
    { Modal: <TAndCModal /> },
    { Modal: <RulesAndRegulationsModal /> },
    { Modal: <KycModal /> },
    { Modal: <ResponsibleGamingModal /> },
    // { Modal: <AboutUsModal /> },
    // { Modal: <SelfExecutionModal /> },
    // { Modal: <UnderagePolicyModal /> },
  ];

  const handleSocialHover = (index: number) => {
    setActiveSocial(index);

    const el = iconRefs.current[index];
    if (el) {
      const parentRect = el.parentElement?.parentElement?.getBoundingClientRect();
      const rect = el.getBoundingClientRect();

      if (parentRect) {
        setArrowLeft(rect.left - parentRect.left + rect.width / 2);
      }
    }
  };

  useEffect(() => {
    handleSocialHover(0);
  }, []);

  return (
    <footer className="bg-[#efefef] py-4">
      {/* Social Icons */}
      <div className="bg-[#ffffff80]">
        {/* Icons */}
        <div className="flex justify-center gap-6 pt-3 text-[26px] text-[#8c8c8c]">
          {socialLinks.map((item, index) => (
            <button
              key={index}
              ref={(el) => {
                iconRefs.current[index] = el;
              }}
              onMouseEnter={() => handleSocialHover(index)}
              onClick={() => handleSocialHover(index)}
              className="text-[26px] text-[#8c8c8c] hover:text-[#666]"
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Divider directly under icons */}
        <div className="mt-3 border-t border-[#cfcfcf]" />

        {/* Active Item */}
        <div className="relative flex justify-center py-2">
          <div
            className="
              absolute
              -top-[7px]
              w-3
              h-3
              bg-[#f8f8f8]
              border-r
              border-b
              border-[#cfcfcf]
              rotate-45
              transition-all
              duration-200
            "
            style={{
              left: `${arrowLeft}px`,
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />

          <a
            href={socialLinks[activeSocial]!.href}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-black underline"
          >
            {socialLinks[activeSocial]!.content}
          </a>
        </div>
      </div>

      {/* Browser Icons */}
      <div className="flex justify-center gap-3 mt-5 text-gray-500 text-xl">
        <FaChrome />
        <FaFirefoxBrowser />
      </div>

      {/* Browser Text */}
      <p className="text-center text-[11px] text-gray-600 mt-2">
        Our website works best in the latest and latest previous versions of these browsers: Google
        Chrome, Firefox
      </p>

      {/* Policy Links */}
      <div className="mt-4">
        <div className="max-w-2xl mx-auto border-t border-gray-400 mb-3" />

        <div className="flex flex-wrap justify-center items-center text-[12px] gap-1 text-gray-700">
          {FooterLinks.map(({ Modal }, index) => (
            <React.Fragment key={index}>
              {index === 0 && <span>-</span>}
              {Modal}
              <span>-</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Betfair + App Download */}
      <div className="mt-6 mb-8 flex justify-center">
        <div className="flex items-center border border-gray-400 rounded-md">
          <div className="px-3 py-2">
            <img src="/images/skyexchHome/betfair.png" alt="Betfair" className="h-5" />
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-gray-400"></div>

          <div className="px-2 py-1">
            <img
              src="/images/skyexchHome/downloadApp.png"
              alt="Download App"
              className="h-14 p-1 pl-0 pr-4"
            />
            <p className=" text-10 text-left text-gray-800">v1.11 - 2022-03-23 - 3.1MB</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
