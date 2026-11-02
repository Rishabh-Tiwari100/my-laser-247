import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { Alert: notifications } = useSelector(
    (state: RootState) => state.notification.notifications
  );

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className=" relative z-[2147483647] w-full max-w-3xl mx-4 rounded-xl text-white shadow-2xl">
        {/* Header */}
        <div className="rounded-t-lg px-3 py-1.5 flex justify-between items-center bg-gradient-green">
          <h2 className="uppercase font-bold tracking-wide">Notifications</h2>
          <button
            onClick={onClose}
            className="bg-black text-white rounded-full p-1 hover:opacity-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[70vh] overflow-y-auto scrollbar-hidden bg-white/70 backdrop-blur-lg shadow-2xl rounded-b-lg">
          <div className="flex flex-col gap-1 py-2 px-1.5">
            {!Array.isArray(notifications) || notifications.length === 0 ? (
              <p className="my-4">No Notification Available</p>
            ) : (
              notifications?.map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] bg-black flex flex-col overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpanded((prev) => (prev === idx ? null : idx))}
                    className="rounded-full border-2 border-primary-light flex justify-between items-center w-full px-3 py-1 bg-black text-white font-semibold text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {expanded === note.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <div className="flex gap-x-2 items-center">
                        <span className="text-[13px] sm:text-base whitespace-nowrap">
                          {dayjs(note.createdAt).format('DD MMM HH:mm')}
                        </span>
                        <span className="text-left text-xs font-medium line-clamp-1">
                          {note.title}
                        </span>
                      </div>
                    </div>
                  </button>

                  {expanded === idx && (
                    <div className="px-2.5 py-2 text-13 bg-black text-gray-100">{note.body}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationsPanel;
