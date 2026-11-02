import { resolveValue, ToastBar, Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={6}
      containerClassName="app-toast-viewport"
      containerStyle={{
        top: 10,
        left: 10,
        right: '14.4%',
      }}
      toastOptions={{
        duration: 3000,
        style: {
          width: '400px',
          maxWidth: 'calc(100vw - 24px)',
          minHeight: '38px',
          padding: '8px 10px',
          background: '#243a48',
          color: '#fff',
          border: 0,
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '16px',
        },
        success: {
          style: {
            background: '#4caf50',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#4caf50',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ff2025',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ff2025',
          },
        },
        loading: {
          style: {
            background: '#243a48',
          },
          iconTheme: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.35)',
          },
        },
      }}
    >
      {(toast) => (
        <ToastBar toast={toast}>
          {({ icon }) => (
            <div className="flex w-full min-w-0 items-center gap-[9px]">
              {icon && <span className="flex shrink-0 items-center">{icon}</span>}
              <div {...toast.ariaProps} className="min-w-0 flex-1 break-words text-left text-white">
                {resolveValue(toast.message, toast)}
              </div>
            </div>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
}
