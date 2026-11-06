import { useState } from 'react';
import { mdiChevronRight, mdiDownload } from '@mdi/js';

const APK_URL = 'https://speedcdn.io/apk8/mylaser247com-v8.apk';

export default function AppInstallButtons() {
  const [message, setMessage] = useState('');
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Laser247',
          text: 'Download the My Laser247 app.',
          url: APK_URL,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(APK_URL);
        setMessage('APK link copied. Share it with a friend.');
      } else {
        setMessage(`Share this APK link: ${APK_URL}`);
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        setMessage(`Share this APK link: ${APK_URL}`);
      }
    }
  };
  return (
    <div className="mt-[5px] md:mt-[15px]">
      <a
        href={APK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[40px] w-full items-center justify-center rounded-t-[2px] bg-[#1abc9c] px-[14.4px] text-[14px] font-bold leading-[21px] text-white shadow-[0_0_8px_#16b99e55] md:h-[63.25px]"
      >
        <svg
          viewBox="0 0 512 512"
          className="h-[35px] w-[35px] shrink-0 fill-current"
          aria-hidden="true"
        >
          <path d="M335.413,62.069l32.308-47.853c2.808-4.158,1.702-9.856-2.455-12.664c-4.158-2.807-9.856-1.701-12.664,2.456 L319.235,53.43C299.968,44.637,278.554,39.737,256,39.737c-22.553,0-43.967,4.9-63.234,13.694L159.398,4.008 c-2.807-4.157-8.506-5.263-12.663-2.456c-4.158,2.808-5.263,8.505-2.456,12.664l32.308,47.853 c-40.562,24.799-68.666,67.984-72.608,117.976h304.044C404.08,130.053,375.975,86.87,335.413,62.069z M193.951,133.99 c-11.754,0-21.283-9.528-21.283-21.283c0-11.755,9.529-21.283,21.283-21.283c11.754,0,21.283,9.528,21.283,21.283 C215.234,124.462,205.705,133.99,193.951,133.99z M318.05,133.99c-11.754,0-21.283-9.528-21.283-21.283 c0-11.755,9.529-21.283,21.283-21.283c11.754,0,21.283,9.528,21.283,21.283C339.333,124.462,329.804,133.99,318.05,133.99z" />
          <path d="M101.653,244.206v175.82c0,13.804,11.28,25.084,25.084,25.084h41.472v41.046 c0,14.198,11.615,25.844,25.844,25.844c14.198,0,25.844-11.645,25.844-25.844V445.11h72.971v41.046 c0,14.198,11.615,25.844,25.844,25.844c14.199,0,25.844-11.645,25.844-25.844V445.11h36.059c13.774,0,25.084-11.28,25.084-25.084 v-175.82v-37.245H101.653V244.206z" />
          <path d="M46.75,206.961c-16.426,0-29.864,13.438-29.864,29.864V335.2c0,16.425,13.439,29.864,29.864,29.864 c16.425,0,29.864-13.439,29.864-29.864v-98.375C76.614,220.4,63.175,206.961,46.75,206.961z" />
          <path d="M465.251,206.961c-16.425,0-29.864,13.438-29.864,29.864V335.2c0,16.425,13.439,29.864,29.864,29.864 c16.425,0,29.864-13.439,29.864-29.864v-98.375C495.114,220.4,481.675,206.961,465.251,206.961z" />
        </svg>
        Download .Apk
        <svg
          viewBox="0 0 24 24"
          className="ml-[6px] h-[30px] w-[30px] shrink-0 fill-current"
          aria-hidden="true"
        >
          <path d={mdiDownload} />
        </svg>
      </a>
      <button
        type="button"
        onClick={share}
        className="flex h-[40px] w-full items-center justify-center gap-[5px] rounded-b-[2px] bg-[#4b278b] px-[14.4px] text-[12px] font-bold uppercase leading-[21px] text-white md:h-[61.375px]"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-[30px] w-[30px] shrink-0 fill-current"
          aria-hidden="true"
        >
          <path d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z" />
        </svg>
        Share this APK to friend
        <svg
          viewBox="0 0 24 24"
          className="ml-[6px] h-[30px] w-[30px] shrink-0 fill-current"
          aria-hidden="true"
        >
          <path d={mdiChevronRight} />
        </svg>
      </button>
      {message && (
        <p role="status" className="mt-[8px] break-words text-[12px] leading-relaxed text-white">
          {message}
        </p>
      )}
    </div>
  );
}
