import { useGetFancyProfitLossQuery } from '@/store/api/booksetApi';
import { Icons } from '@/utils/icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

interface BookListModalProps {
  open: boolean;
  onClose: () => void;
  selectionId: string | number | undefined;
  marketId?: string;
}

function BookListModal({ open, onClose, selectionId, marketId }: BookListModalProps) {
  const { eventId } = useParams();

  const { data, isLoading, error } = useGetFancyProfitLossQuery(
    {
      eventId: Number(eventId),
      selectionId: selectionId ? String(selectionId) : '',
      marketId: marketId!,
    },
    { skip: !open }
  );

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2147483647] opacity-100"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="fixed z-[2147483647] top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-black rounded shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 ">
          <h2 className="text-2xl font-bold text-white">BOOK LIST</h2>
          <button onClick={onClose} className="text-white text-xl hover:text-red-500">
            <Icons.close />
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-left text-white text-sm">
            <thead className="">
              <tr className="bg-primary-dark">
                <th className="p-2 px-4">Runner Name</th>
                <th className="p-2">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="p-3 text-center" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-red-400 font-semibold">
                    Failed to fetch data
                  </td>
                </tr>
              )}

              {Array.isArray(data) &&
                data?.map((item: any, i: number) => (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? 'bg-gray-700' : 'bg-black'} border-b border-gray-800`}
                  >
                    <td className="p-3 capitalize pl-5">{item.position}</td>
                    <td
                      className={`p-3 font-semibold ${
                        item?.profit_or_loss < 0
                          ? 'text-red-400'
                          : item?.profit_or_loss > 0 && 'text-green-400'
                      }`}
                    >
                      {item?.profit_or_loss.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>,
    document.body
  );
}

export default React.memo(BookListModal);
