import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PromotionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const banners =
    useAppSelector((state: RootState) => state.banner.banners.WebBanner?.PromotionBanner) ?? [];
  const promotion = banners.find(({ id: bannerId }) => id == bannerId);

  return (
    <div className="rounded-2xl pb-10 m-3">
      <div className=" flex items-center justify-between mb-2 lg:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="size-[30px] border border-primary-200 rounded-lg bg-gradient-primary"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <a
          href="https://notoutoffers.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap px-1.5 animate-pulse py-1 rounded-sm text-sm font-semibold text-white bg-gradient-primary"
        >
          KNOW MORE
        </a>
      </div>
      <div className="p-3 lg:p-6  ">
        <div className="w-full ">
          <img src={promotion?.image} className=" w-full max-h-[375px] rounded-xl" alt="" />
        </div>
        <h1 className="text-[20px] font-semibold pt-3">{promotion?.heading}</h1>
        <div
          className="!text-[#AFB4C6] pt-3"
          dangerouslySetInnerHTML={{
            __html: promotion?.description || '',
          }}
        />
      </div>
    </div>
  );
};

export default PromotionDetails;
