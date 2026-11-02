import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="max-lg:hidden border-t border-[rgba(0,0,0,.3)] !my-10 pt-1.5">
      <div className="block text-[#0009] text-[13px] leading-[22px] my-2.5 text-center">
        <div className="">
          <Link to="#" className="ml-[5px] text-white text-sm">
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            KYC
          </Link>
          <Link
            to="#"
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Terms and conditions
          </Link>
          <Link
            to="#"
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Rules and Regulations
          </Link>
          <Link
            to="#"
            className="ml-[5px] text-white text-sm before:mx-[10px] before:content-['|'] before:inline-block"
          >
            Responsible Gambling
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
