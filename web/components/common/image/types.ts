interface ImagePropsBase {
  src: string;
  srcDark?: string;
  alt: string;
  loader?: boolean;
  priority?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
  border?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  cover?: boolean;
}

interface ImagePropsFullWidth extends ImagePropsBase {
  fullWidth: boolean;
  width?: number;
  height?: number;
}

interface ImagePropsWithoutFullWidth extends ImagePropsBase {
  fullWidth?: boolean;
  width: number;
  height: number;
}

export type ImageProps = ImagePropsFullWidth | ImagePropsWithoutFullWidth;
