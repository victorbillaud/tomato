import Image from 'next/image';
import React from 'react';
import { ImageProps } from './types';

type ICustomImageProps = ImageProps & React.ImgHTMLAttributes<HTMLImageElement>;

export function CustomImage({
  src,
  srcDark,
  alt = src,
  loader = true,
  fullWidth = false,
  width,
  height,
  priority = false,
  placeholder,
  className,
  cover = false,
  ...props
}: ICustomImageProps) {
  const roundedClass: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const shadowClass: Record<string, string> = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={`relative overflow-hidden ${
        shadowClass[props.shadow || '']
      } ${className} ${
        props.border ? 'border-white-300 dark:border-dark-300 border' : ''
      } ${roundedClass[props.rounded || '']} `}
      style={{
        height: `${height}px`,
        width: fullWidth ? '100%' : `${width}px`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill={true}
        objectFit={cover ? 'cover' : 'default'}
        priority={priority}
        placeholder={loader ? 'blur' : 'empty'}
        blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`}
        className={`absolute left-0 top-0 h-full w-full  ${
          roundedClass[props.rounded || '']
        } `}
        {...props}
      />
    </div>
  );
}
