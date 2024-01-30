'use client';

import { Tables } from '@utils/lib/supabase/supabase_types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon } from '../common/icon';
import { Tag } from '../common/tag';
import * as Tooltip from '../radix/Tooltip';
import {
    LazyMapContainer,
    LazyMarker,
    LazyPopup,
    LazyTileLayer,
} from './LazyLeaflet';

interface ILocationTooltipProps {
  scan: Tables<'scan'>;
}

export const LocationTooltip = (props: ILocationTooltipProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isOpen} onOpenChange={setOpen}>
        <Tooltip.Trigger>
          <button onClick={() => setOpen(!isOpen)}>
            <Tag
              text='Precise location'
              color='green'
              size='small'
              icon='map-pin'
            />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className='data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade rounded-lg data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none border border-stone-300 bg-zinc-100/80 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] backdrop-blur-lg will-change-[transform,opacity] dark:border-stone-700 dark:bg-zinc-900/70'
            sideOffset={5}
          >
            <ItemScanHistoryLocationMap scan={props.scan} />
            <Tooltip.Arrow className='fill-zinc-100/80 dark:fill-zinc-900/70' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

interface IItemScanHistoryMapLocationProps {
  scan: Tables<'scan'>;
}

export default function ItemScanHistoryLocationMap(
  props: IItemScanHistoryMapLocationProps
) {
  const latitude = props.scan.geo_location_metadata['latitude'];
  const longitude = props.scan.geo_location_metadata['longitude'];
  const accuracy = props.scan.geo_location_metadata['accuracy'];

  return (
    <LazyMapContainer
      center={[latitude, longitude]}
      zoom={11}
      scrollWheelZoom={false}
      zoomControl={true}
      style={{ height: '200px', width: '300px', borderRadius: '8px' }}
    >
      <LazyTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      />
      <LazyMarker position={[latitude, longitude]} icon={getMarkerIcon()}>
        <LazyPopup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </LazyPopup>
      </LazyMarker>
    </LazyMapContainer>
  );
}

export const getMarkerIcon = () => {
  const marker = renderToStaticMarkup(
    <Icon name='map-pin' color={'text-primary-500'} fill className='z-10' />
  );

  return L.divIcon({
    html: marker,
    className: 'hidden',
    iconSize: [20, 20],
    iconAnchor: [20, 20],
    popupAnchor: [0, 0],
  });
};
