'use client';

import Cookies from 'js-cookie';
import React, { useEffect } from 'react';

interface ICookieSetterProps {
  itemId: string;
  qrcodeId: string;
}

export const CookieSetter: React.FC<ICookieSetterProps> = ({
  itemId,
  qrcodeId,
}) => {
  useEffect(() => {
    // Function to check and update the "last_scan" cookie
    const checkAndUpdateCookie = () => {
      const lastScanCookie = Cookies.get('last_scan')
        ? JSON.parse(Cookies.get('last_scan') || '')
        : null;
      const currentTime = new Date().getTime();

      // Check if the cookie exists and the time difference is not less than 1 minute
      if (!lastScanCookie || currentTime - lastScanCookie.timestamp >= 60000) {
        // Update the "last_scan" cookie with the current timestamp and item_id, qrcode_id
        Cookies.set(
          'last_scan',
          JSON.stringify({
            timestamp: currentTime,
            item_id: itemId,
            qrcode_id: qrcodeId,
          })
        );
      }
    };

    // Call the function when the component mounts
    checkAndUpdateCookie();

    // Cleanup function to prevent memory leaks
    return () => {
      // Any cleanup code if needed
    };
  }, [itemId, qrcodeId]); // Include itemId and qrcodeId in the dependency array

  // Your component JSX
  return <></>;
};
