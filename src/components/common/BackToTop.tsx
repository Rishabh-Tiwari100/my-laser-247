import React, { useEffect, useState } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const footer = document.querySelector('footer');
      const footerVisible = footer && footer.getBoundingClientRect().top < window.innerHeight;
      setIsVisible(window.scrollY > 300 && !footerVisible);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[140px] right-[20px] z-[9]">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="size-10 bg-[#ffe31e] rounded-[100px] flex items-center justify-center"
        aria-label="Back to top"
      >
        <img src="/icons/arrow_up.png" alt="" className="max-w-[30px]" />
      </button>
    </div>
  );
};

export default BackToTop;
