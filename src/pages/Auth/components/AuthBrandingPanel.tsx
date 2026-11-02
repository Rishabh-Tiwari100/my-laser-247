import { cn } from '@/utils';
import React from 'react';
import { Link } from 'react-router-dom';

function AuthBrandingPanel({ type }: { type: string }) {
  return (
    <div className={cn("flex col-span-12 md:col-span-5 flex-col items-center px-3", type == "login" ? "justify-center" : "")}>
      <div className='text-center'>
          <img
            src="/images/logo.png"
            alt="LASER 247"
            className="w-[146px] lg:w-[170px] h-auto mx-auto max-w-full align-middle"
          />
        <img
          src="/images/auth-image.webp"
          alt=""
          className="w-[146px] lg:w-[170px] mt-[25px] max-w-full h-auto mx-auto max-md:hidden align-middle"
        />
      </div>
    </div>
  );
}

export default AuthBrandingPanel;
