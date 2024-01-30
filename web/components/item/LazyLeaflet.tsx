import dynamic from 'next/dynamic';

export const LazyMarker = dynamic(
  async () => (await import('react-leaflet')).Marker,
  {
    ssr: false,
  }
);

export const LazyMapContainer = dynamic(
  async () => (await import('react-leaflet')).MapContainer,
  {
    ssr: false,
  }
);

export const LazyLayersControl = dynamic(
  async () => (await import('react-leaflet')).LayersControl,
  {
    ssr: false,
  }
);

export const LazyTileLayer = dynamic(
  async () => (await import('react-leaflet')).TileLayer,
  {
    ssr: false,
  }
);

export const LazyTooltip = dynamic(
  async () => (await import('react-leaflet')).Tooltip,
  {
    ssr: false,
  }
);

export const LazyPopup = dynamic(
  async () => (await import('react-leaflet')).Popup,
  {
    ssr: false,
  }
);

export const LazyCircle = dynamic(
  async () => (await import('react-leaflet')).Circle,
  {
    ssr: false,
  }
);
