import PageHeader from './components/PageHeader';
import Pagination from './components/Pagination';

const rows = [
  {
    date: '2026-06-27 15:44:35',
    status: 'success',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:44:04',
    status: 'success',
    ip: '78.129.229.29',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:43:43',
    status: 'success',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:35:11',
    status: 'success',
    ip: '78.129.229.29',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:32:29',
    status: 'failed',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:31:09',
    status: 'success',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 15:03:42',
    status: 'success',
    ip: '78.129.229.29',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 14:53:38',
    status: 'success',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 14:51:27',
    status: 'success',
    ip: '78.129.229.29',
    isp: '****',
    location: '****',
  },
  {
    date: '2026-06-27 14:50:52',
    status: 'success',
    ip: '85.114.138.26',
    isp: '****',
    location: '****',
  },
];

export default function ActivityLog() {
  return (
    <div className="bg-[#f5f5f5] border border-[#cfcfcf]">
      <PageHeader title="Activity Log" />

      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#efefef] border-y border-[#d7d7d7] text-[#222]">
            <th className="px-3 py-[7px] text-left font-semibold">Login Date & Time</th>

            <th className="px-3 py-[7px] text-left font-semibold">Login Status</th>

            <th className="px-3 py-[7px] text-left font-semibold">IP Address</th>

            <th className="px-3 py-[7px] text-center font-semibold">ISP</th>

            <th className="px-3 py-[7px] text-center font-semibold">City/State/Country</th>

            <th className="px-3 py-[7px] text-center font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-[#ececec] bg-white hover:bg-[#fafafa]">
              <td className="px-3 py-[7px] whitespace-nowrap">{row.date}</td>

              <td className="px-3 py-[7px]">
                {row.status === 'success' ? (
                  <span className="text-[#5b9200]">Login Success</span>
                ) : (
                  <span className="text-[#e00000]">Login Failed</span>
                )}
              </td>

              <td className="px-3 py-[7px]">{row.ip}</td>

              <td className="px-3 py-[7px] text-center">{row.isp}</td>

              <td className="px-3 py-[7px] text-center">{row.location}</td>

              <td className="px-3 py-[7px] text-center">
                <button
                  className="
                    rounded
                    border
                    border-[#a8a8a8]
                    bg-gradient-to-b
                    from-white
                    to-[#dcdcdc]
                    px-2
                    py-[2px]
                    text-[12px]
                    font-bold
                    shadow-sm
                  "
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination />
    </div>
  );
}
