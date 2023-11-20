'use client';

import generateQRCode from '@utils/lib/qrcode/generator';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from '../common/icon';
import { Text } from '../common/text';

interface QrCodeProps {
  url: string;
  size?: number;
  download?: boolean;
}

export const QrCode: React.FC<QrCodeProps> = ({
  url,
  size = 250,
  download = false,
}) => {
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
          <div
            className='animate-pulse rounded-md bg-stone-300 dark:bg-stone-700'
            style={{
              width: size,
              height: size,
            }}
          />
        )}
      </div>
      {qrCodeUrl && download && (
        <a href={qrCodeUrl} download='qr-code.png' className='py-2'>
          <div className='flex flex-row items-center justify-center'>
            <Icon
              name='download'
              size={18}
              className='mr-2'
              color='text-gray-700 dark:text-gray-200'
            />
            <Text variant='caption' weight={500} className='text-center'>
              Download
            </Text>
          </div>
        </a>
      )}
    </div>
  );
};
