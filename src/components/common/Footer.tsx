import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="max-lg:hidden border-t border-[rgba(0,0,0,.3)] !my-10 pt-1.5">
      <div className="block text-[#0009] text-[13px] leading-[22px] my-2.5 text-center">
        <div className="">
          <span className="ml-[5px] text-white text-sm">
            Privacy Policy
          </span>
          <Link
            to="#"
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            KYC
          </Link>
          <span
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Terms and conditions
          </span>
          <span
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Rules and Regulations
          </span>
          <span
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Responsible Gambling
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
