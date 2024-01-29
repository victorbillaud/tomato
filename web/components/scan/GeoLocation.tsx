'use client';

import { createClient } from '@/utils/supabase/client';
import { updateGeoLocationMetadata } from '@utils/lib/scan/services';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '../common/button';
import { Icon } from '../common/icon';
import { Text } from '../common/text';

interface GeoLocationProps {
  scanId?: string;
}

export default function GeoLocation({ scanId }: GeoLocationProps) {
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean | null>(null);
  const supabase = createClient();

  const handleSuccess = useCallback(
    async (pos: GeolocationPosition) => {
      setPosition(pos);
      if (scanId) {
        await updateGeoLocationMetadata(supabase, scanId, pos);
      }
      setIsLoaded(true);
    },
    [scanId]
  );

  function handleGeoLocation() {
    if (navigator.geolocation) {
      setIsLoaded(false);
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  function handleError(error: GeolocationPositionError) {
    setError(error);
    setIsLoaded(true);
  }

  const renderAlert = useMemo(() => {
    let message = '';
    switch (error?.code) {
      case error?.PERMISSION_DENIED:
        message =
          'To help the user to find his item faster, you can give us your location.';
        break;
      case error?.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case error?.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      default:
        message = 'An unknown error occurred.';
        break;
    }

    if (error) {
      return (
        <div className='mx-3 flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-red-200/60 p-2 py-3 dark:bg-red-200/20 sm:mx-0 sm:shadow-none'>
          <Text
            variant='body'
            color='text-red-500'
            weight={600}
            className='text-center opacity-90'
          >
            {message}
          </Text>
          <Text
            variant='caption'
            color='text-red-500'
            className='text-center opacity-70'
          >
            Go to your browser settings and allow location access to Tomato.
          </Text>
        </div>
      );
    }
    return null;
  }, [error]);

  const renderSuccess = useMemo(() => {
    if (position) {
      return (
        <div className='mx-3 flex w-full flex-row items-center justify-center gap-2 rounded-lg border-green-300 bg-green-200/60 p-2 py-3 dark:bg-green-200/20 sm:mx-0 sm:shadow-none'>
          <Icon name='current-location' color='text-green-500' />
          <Text
            variant='body'
            color='text-green-500'
            className='text-center opacity-90'
          >
            Your location has been found ! Thanks for helping the user to find
            his item faster.
          </Text>
        </div>
      );
    }
    return null;
  }, [position]);

  return isLoaded ? (
    position ? (
      renderSuccess
    ) : (
      renderAlert
    )
  ) : (
    <div className='mx-3 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-green-300 bg-green-200/60 p-2 py-3 dark:bg-green-200/20 sm:mx-0 sm:shadow-none'>
      <Text
        variant='body'
        color='text-green-500'
        className='text-center opacity-90'
      >
        To help the user to find his item faster, you can give us your location.
      </Text>
      <Button
        variant='tertiary'
        isLoader={isLoaded === false}
        onClick={handleGeoLocation}
        className='text-green-500'
        text='Share your location'
      />
    </div>
  );
}
