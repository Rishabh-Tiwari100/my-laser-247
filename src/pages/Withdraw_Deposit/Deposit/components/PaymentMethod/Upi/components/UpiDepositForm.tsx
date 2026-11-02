import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { FiInfo, FiUploadCloud, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as Tesseract from 'tesseract.js';
import { useUploadFileMutation } from '@/store/api/upload.Api';
import { useIsDemoUser } from '@/hooks/redux';
import LoaderTwo from '@/components/common/LoaderTwo';
import HoverTooltip from '@/components/common/HoverTooltip';
import { extractUtrFromText } from '@/utils/utr';

interface UpiDepositFormProps {
  disabled?: boolean;
  isSubmitting: boolean;
  resetKey: number;
  onSubmit: (values: { paymentProof: string; utr: string }) => Promise<void>;
}

const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const SUPPORTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DEPOSIT_IMAGE_ACCEPT = [
  ...SUPPORTED_IMAGE_EXTENSIONS.map((extension) => `.${extension}`),
  ...SUPPORTED_IMAGE_MIME_TYPES,
].join(',');

function UpiDepositForm({
  disabled = false,
  isSubmitting,
  resetKey,
  onSubmit,
}: UpiDepositFormProps) {
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [utr, setUtr] = useState('');
  const [proofError, setProofError] = useState('');
  const [utrError, setUtrError] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isExtractingUtr, setIsExtractingUtr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ocrRequestRef = useRef(0);
  const previewUrlRef = useRef('');
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const isDemoUser = useIsDemoUser();
  const ocrStatusClassName = isExtractingUtr
    ? 'text-[#667080]'
    : ocrStatus.startsWith('Detected')
      ? 'text-[#0f7b45]'
      : 'text-red-600';

  const clearPreviewUrl = () => {
    if (!previewUrlRef.current) return;
    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = '';
  };

  useEffect(() => {
    ocrRequestRef.current += 1;
    clearPreviewUrl();
    setFileName('');
    setPreviewUrl('');
    setPaymentProof('');
    setUtr('');
    setProofError('');
    setUtrError('');
    setOcrStatus('');
    setOcrProgress(0);
    setIsExtractingUtr(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [resetKey]);

  useEffect(
    () => () => {
      clearPreviewUrl();
    },
    []
  );

  const clearSelectedScreenshot = () => {
    ocrRequestRef.current += 1;
    clearPreviewUrl();
    setFileName('');
    setPreviewUrl('');
    setPaymentProof('');
    setOcrStatus('');
    setOcrProgress(0);
    setIsExtractingUtr(false);
    setProofError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const extractUtrFromImage = async (file: File, requestId: number) => {
    setIsExtractingUtr(true);
    setOcrProgress(0);
    setOcrStatus('Manual UTR Number extraction is in progress...');

    let worker: Tesseract.Worker | null = null;

    try {
      worker = await Tesseract.createWorker('eng', Tesseract.OEM.LSTM_ONLY, {
        logger: ({ progress, status }) => {
          if (requestId !== ocrRequestRef.current || status !== 'recognizing text') return;
          setOcrProgress(Math.round(progress * 100));
        },
      });

      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
        preserve_interword_spaces: '1',
      });

      const {
        data: { text },
      } = await worker.recognize(file);
      if (requestId !== ocrRequestRef.current) return;

      const extractedUtr = extractUtrFromText(text);
      if (!extractedUtr) {
        setOcrStatus('UTR not detected. Please enter it manually.');
        return;
      }

      setUtr((currentUtr) => {
        if (currentUtr.trim()) return currentUtr;
        setUtrError('');
        return extractedUtr;
      });
      setOcrStatus('');
    } catch {
      if (requestId === ocrRequestRef.current) {
        setOcrStatus('Could not scan screenshot. Please enter UTR manually.');
      }
    } finally {
      await worker?.terminate();
      if (requestId === ocrRequestRef.current) {
        setIsExtractingUtr(false);
        setOcrProgress(0);
      }
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    ocrRequestRef.current += 1;
    const requestId = ocrRequestRef.current;
    setOcrStatus('');
    setOcrProgress(0);
    setIsExtractingUtr(false);

    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const isSupportedImage =
      SUPPORTED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase()) ||
      SUPPORTED_IMAGE_EXTENSIONS.includes(fileExtension);

    if (!isSupportedImage) {
      toast.error('Please upload a valid image (JPG, JPEG, PNG, WEBP)', {
        id: 'upi-file-select',
      });
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB', { id: 'upi-file-select' });
      event.target.value = '';
      return;
    }

    setProofError('');
    setFileName(file.name);
    setPaymentProof('');
    setUtr('');
    setUtrError('');
    clearPreviewUrl();
    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);

    void extractUtrFromImage(file, requestId);

    try {
      const response = await uploadFile(file).unwrap();
      setPaymentProof(response.url);
      toast.success('Uploaded Successfully!', { id: 'upi-file-select' });
    } catch {
      ocrRequestRef.current += 1;
      setFileName('');
      clearPreviewUrl();
      setPreviewUrl('');
      setUtr('');
      setOcrStatus('');
      setOcrProgress(0);
      setIsExtractingUtr(false);
      event.target.value = '';
      toast.error('Upload failed, please try again.', { id: 'upi-file-select' });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUtr = utr.trim();
    let isValid = true;

    if (!paymentProof) {
      setProofError('Payment screenshot is required');
      isValid = false;
    }

    if (!/^\d{6,22}$/.test(normalizedUtr)) {
      setUtrError('Enter a 6-22 digit UTR number');
      isValid = false;
    }

    if (!isValid || isUploading) return;
    await onSubmit({ paymentProof, utr: normalizedUtr });
  };

  const formDisabled = disabled || isDemoUser;

  return (
    <form onSubmit={handleSubmit} className={formDisabled ? 'pointer-events-none opacity-70' : ''}>
      <section className="mt-[10px] rounded-[5px] border border-[#d0d0d0] bg-white p-[10px]">
        <div className="mb-[3px] flex items-center gap-[4px]">
          <label htmlFor="upi-payment-proof" className="text-sm">
            Upload a Screenshot<span className="text-red-600">*</span>
          </label>
          <HoverTooltip
            width="w-[180px]"
            content={<div className="text-center">Upload transaction screenshot</div>}
          >
            <button
              type="button"
              className="inline-flex size-4 items-center justify-center text-[#02add1] outline-none"
              aria-label="Upload screenshot help"
            >
              <FiInfo className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </HoverTooltip>
        </div>
        {previewUrl ? (
          <div className="relative flex items-center justify-center overflow-hidden rounded-[8px] bg-[#f3f2f6] px-[12px]">
            <div className="relative">
              <img
                src={previewUrl}
                alt={fileName || 'Uploaded payment screenshot'}
                className={`block h-[180px] w-auto max-w-[260px] object-contain transition-[filter,opacity] duration-200 ${
                  isExtractingUtr ? 'opacity-40 grayscale' : ''
                }`}
              />
              {isExtractingUtr && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-[64px] w-[64px] items-center justify-center">
                    <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                      <circle cx="32" cy="32" r="27" fill="none" stroke="#d8dee3" strokeWidth="6" />
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        fill="none"
                        stroke="#243a48"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 27}
                        strokeDashoffset={2 * Math.PI * 27 * (1 - ocrProgress / 100)}
                        className="transition-[stroke-dashoffset] duration-200 ease-linear"
                      />
                    </svg>
                    <span className="absolute text-[13px] font-semibold text-[#243a48]">
                      {ocrProgress}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute right-[5px] top-[5px] flex size-6 items-center justify-center rounded-full bg-[#e00000] text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              aria-label="Remove uploaded screenshot"
              onClick={clearSelectedScreenshot}
            >
              <FiX className="h-[22px] w-[22px]" aria-hidden="true" />
            </button>
            {ocrStatus && (
              <p className={`absolute bottom-[12px] left-[13px] text-[13px] ${ocrStatusClassName}`}>
                {ocrStatus}
              </p>
            )}
          </div>
        ) : (
          <label
            htmlFor="upi-payment-proof"
            className="flex h-[41px] cursor-pointer items-center gap-[6px] overflow-hidden rounded-[3px] border border-dotted border-[#777] px-[10px] text-[13px]"
          >
            <FiUploadCloud className="h-[20px] w-[20px] shrink-0" aria-hidden="true" />
            <span className="truncate">Upload screenshot</span>
            {isUploading && <span className="ml-auto shrink-0 text-[11px]">Uploading...</span>}
          </label>
        )}
        <input
          ref={fileInputRef}
          id="upi-payment-proof"
          type="file"
          accept={DEPOSIT_IMAGE_ACCEPT}
          onChange={handleFileSelect}
          className="hidden"
        />
        {proofError && <p className="mt-1 text-[11px] text-red-600">{proofError}</p>}
      </section>

      <section className="mt-[10px] rounded-[5px] border border-[#d0d0d0] bg-white p-[10px]">
        <div className="mb-[5px] flex items-center gap-[4px]">
          <label htmlFor="upi-utr-number" className="text-[14px] leading-[17px]">
            UTR Number<span className="text-red-600">*</span>
          </label>
          <HoverTooltip
            width="w-[180px]"
            content={<div>Enter generated UTR number from transaction</div>}
          >
            <button
              type="button"
              className="inline-flex h-[15px] w-[15px] items-center justify-center text-[#02add1] outline-none"
              aria-label="UTR number help"
            >
              <FiInfo className="h-[15px] w-[15px]" aria-hidden="true" />
            </button>
          </HoverTooltip>
        </div>
        <p className="mb-[6px] text-[12px] font-semibold leading-[16px] text-red-600">
          Please check UTR number before proceeding.
        </p>
        <input
          id="upi-utr-number"
          value={utr}
          maxLength={22}
          autoComplete="off"
          placeholder="Enter UTR number"
          onChange={(event) => {
            setUtr(event.target.value.replace(/\D/g, ''));
            setUtrError('');
          }}
          className="h-[38px] w-full rounded-[4px] border border-[#999] px-[12px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
        />
        {utrError && <p className="mt-1 text-[11px] text-red-600">{utrError}</p>}
      </section>

      <button
        type="submit"
        disabled={formDisabled || isSubmitting || isUploading}
        className="mt-[13px] flex h-[41px] w-full items-center justify-center rounded-[3px] border border-[#111] bg-[#243a48] text-[14px] text-white hover:bg-[#172b38] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <LoaderTwo text="Submitting..." /> : 'Submit Request'}
      </button>
    </form>
  );
}

export default UpiDepositForm;
