import { useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import {
  useGetOneClickBettingQuery,
  useSaveOneClickBettingMutation,
} from '@/store/api/oneClickBettingApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  width?: 'max-w-8xl';
  margin?: 'mx-3';
}

export default function OneClickBetBar({ onClose, width, margin }: Props) {
  const user = useSelector((s: RootState) => s.user.profile);
  const [editing, setEditing] = useState(false);

  const [stakes, setStakes] = useState(['50', '100', '1000']);

  const { data } = useGetOneClickBettingQuery(user?.id ?? '');

  const [saveOneClickBetting, { isLoading }] = useSaveOneClickBettingMutation();

  useEffect(() => {
    if (data?.data) {
      setStakes([
        data.data.firstField ?? '50',
        data.data.secondField ?? '100',
        data.data.thirdField ?? '1000',
      ]);
    }
  }, [data]);

  const updateStake = (index: number, value: string) => {
    const copy = [...stakes];
    copy[index] = value;
    setStakes(copy);
  };

  const handleSave = async () => {
    try {
      await saveOneClickBetting({
        oneClickId: data?.data?.id ?? '',
        firstField: stakes[0] ?? 0,
        secondField: stakes[1] ?? 0,
        thirdField: stakes[2] ?? 0,
      }).unwrap();

      toast.success('Stake Value Saved.');

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sticky bottom-0 w-full flex justify-center">
      <div
        className={`
      w-full
      ${width}
      ${margin}
      h-[31px]
      z-[9999]
      bg-gradient-to-b
      from-[#5ba400]
      via-[#468d00]
      to-[#3d7900]
      border-t
      border-[#2b5600]
    `}
      >
        <div className="relative h-full flex items-center">
          {/* Left */}
          <div className="w-[185px] pl-[10px] text-[12px] font-bold text-white whitespace-nowrap">
            {editing ? 'Edit One Click Bet Stake' : 'One Click Bet Stake'}
          </div>

          {/* Middle */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div
              className="
              h-[30px]
              px-10
              flex
              items-center
              gap-[2px]
              rounded-b-[18px]
              bg-gradient-to-b
              from-[#69b400]
              to-[#4d9600]
              border-l
              border-r
              border-[#4f8600]
            "
            >
              {stakes.map((stake, index) =>
                editing ? (
                  <input
                    key={index}
                    value={stake}
                    onChange={(e) => updateStake(index, e.target.value)}
                    className="
                    w-[54px]
                    h-[18px]
                    text-center
                    text-[11px]
                    border
                    border-[#4f4f4f]
                    bg-white
                    rounded
                    outline-none
                    p-0
                  "
                  />
                ) : (
                  <button
                    key={index}
                    className={`
                    w-[54px]
                    h-[18px]
                    text-[11px]
                    leading-none
                    border
                    rounded

                    ${index === 0 ? 'bg-[#ffc93b] border-[#8d6500]' : 'bg-[#ffffff] border-[#666]'}
                  `}
                  >
                    {stake}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right */}
          <div className="ml-auto pr-[10px]">
            {editing ? (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="
                w-[60px]
                h-[19px]
                text-[12px]
                font-bold
                rounded
                border
                border-[#8d6500]
                bg-gradient-to-b
                from-[#ffc32d]
                to-[#eea000]
                disabled:opacity-50
              "
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="
                w-[60px]
                h-[19px]
                flex
                items-center
                justify-center
                gap-1
                text-[11px]
                text-white
                rounded
                border
                border-[#2a5700]
                bg-gradient-to-b
                from-[#5d9900]
                to-[#3d7300]
              "
              >
                Edit
                <FiEdit2 size={9} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
