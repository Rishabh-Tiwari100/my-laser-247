const Banner = () => (
  <picture className="my-[5px] block">
    <source
      media="(min-width: 1024px)"
      srcSet="/images/banners/bnr1.png"
      width={1920}
      height={300}
    />
    <img
      className="block h-auto w-full max-w-full"
      src="/images/banners/m_bnr1.png"
      width={720}
      height={200}
      alt="Sports promotion"
    />
  </picture>
);

export default Banner;
