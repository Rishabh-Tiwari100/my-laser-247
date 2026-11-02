import BackButton from '@/components/common/BackButton';
import NotOutLoader from '@/components/common/NotOutLoader';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';
import { RootState } from '@/store';
import { useGetBannersQuery } from '@/store/api/bannerApi';
import { Icons } from '@/utils/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Promotions = () => {
  const navigate = useNavigate();
  const { isLoading: isBannersLoading } = useGetBannersQuery(undefined);
  const banners = useSelector((state: RootState) => state.banner.banners);
  const windowWidth = useDeviceWidth();
  const isMobileDevice = windowWidth < 768;
  const promotionBanners = banners?.WebBanner?.PromotionBanner ?? [];

  return (
    <div className="w-full p-2 sm:p-3 pt-0">
      {isBannersLoading && <NotOutLoader />}
      {/* Top Back Bar */}
      <BackButton className="hidden sm:flex" />

      {/* Promotions Header */}
      <div className="mt-2 bg-black rounded-md px-3 py-1.5 flex items-center gap-2">
        <div className="rounded-full text-black bg-white p-1 ">
          <Icons.promotions className="h-3 w-3" />
        </div>
        <span className="text-white text-xs font-semibold uppercase">Promotions</span>
      </div>

      {/* Promotion Card */}
      {Array.isArray(promotionBanners) && promotionBanners.length === 0 ? (
        <p className="my-5 text-center text-xl font-medium">No Promotions Available.</p>
      ) : (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {promotionBanners.map(({ image, id, heading }, idx) => (
            <div key={idx}>
              {image && (
                <div className="border border-green-500 rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt="Promotion"
                    className={`w-full h-auto ${isMobileDevice ? 'aspect-[4/3]' : 'aspect-[16/7]'} object-fill`}
                  />

                  <button
                    onClick={() => navigate(`/promotion/${id}`)}
                    className="w-full text-center truncate px-2 py-1 h-8 font-semibold"
                  >
                    {heading}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Promotions;
