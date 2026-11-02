import React from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RootState } from '@/store';

const WhatsappSupportButton = () => {
  const support = useSelector((state: RootState) => state.contactSupport.data);
  const { whatsapp } = support ?? {};
  const handleClick = () => {

    if (!whatsapp) {
      toast.error('WhatsApp support is currently unavailable.', { id: 'support' });
      return;
    }

    const text = encodeURIComponent('Hello, I need assistance.');
    const url = `${whatsapp}?text=${text}`;
    window.open(url, '_blank');
  };


  return (
    <button
      onClick={() => {
        handleClick();
      }}
      className="fixed z-50 bottom-[60px] right-[10px] flex flex-col  gap-[10px] text-center items-center touch-none select-none"
      aria-label="WhatsApp Support"
    >
      <img src="/icons/whatsapp-support.png" alt="Whatsapp" className="w-[65px] animate-simple-scale" />
    </button>
  );
};

export default WhatsappSupportButton;
