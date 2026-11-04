import { useEffect, useState } from 'react';
import { ChevronRight, Download, Share2, Smartphone } from 'lucide-react';
import { promptAppInstall } from '@/utils/pwa';

export default function AppInstallButtons() {
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onInstalled = () => { setInstalled(true); setMessage('App installed.'); };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  const install = async () => {
    try {
      const result = await promptAppInstall();
      if (result === 'accepted') setMessage('Complete installation in your browser.');
      else if (result === 'unavailable') {
        const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setMessage(isAppleMobile
          ? 'To install, open the Share menu in Safari and choose Add to Home Screen.'
          : 'To install, open your browser menu and choose Install app or Add to Home Screen.');
      }
    } catch {
      setMessage('Open your browser menu to install the app.');
    }
  };

  const share = async () => {
    const url = new URL('/', window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Laser247', text: 'Open My Laser247 and install the app.', url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setMessage('App link copied. Share it with a friend.');
      } else {
        setMessage(`Share this app link: ${url}`);
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        setMessage(`Share this app link: ${url}`);
      }
    }
  };

  return (
    <div className="mt-1 md:mt-[15px]">
      <button type="button" onClick={install} disabled={installed}
        className="flex min-h-10 w-full items-center justify-center gap-1 rounded-t-[2px] bg-[#16b99e] px-3 py-2 text-sm font-bold text-white shadow-[0_0_8px_#16b99e55] disabled:cursor-default md:min-h-[62px]">
        <Smartphone className="h-7 w-7 md:h-9 md:w-9" aria-hidden="true" />
        {installed ? 'App Installed' : 'Install App'}
        {!installed && <Download className="ml-2 h-6 w-6" aria-hidden="true" />}
      </button>
      <button type="button" onClick={share}
        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-b-[2px] bg-[#4b2788] px-3 py-2 text-xs font-bold uppercase text-white md:min-h-[60px]">
        <Share2 className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
        Share this app to friend
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>
      <p role="status" className="mt-2 text-xs leading-relaxed text-white">{message}</p>
    </div>
  );
}
