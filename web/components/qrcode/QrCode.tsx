'use client';

import generateQRCode from '@utils/lib/qrcode/generator';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface QrCodeProps {
  url: string;
  size?: number;
}

export const QrCode: React.FC<QrCodeProps> = ({ url, size = 250 }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      const qrCode = await generateQRCode(url);
      setQrCodeUrl(qrCode);
    }
    generate();
  }, [url]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        {qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt='QR Code'
            width={size}
            height={size}
            className='rounded-md shadow-md'
          />
        ) : (
          <div className='h-72 w-72 animate-pulse rounded-md bg-stone-300 dark:bg-stone-700' />
        )}
      </div>
    </div>
  );
};
