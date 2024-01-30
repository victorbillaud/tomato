import { FunctionComponent } from 'react';
import ICONS from './constant';
import { IIconProps } from './types';

export const Icon: FunctionComponent<IIconProps> = ({
  name,
  size = 24,
  color = 'text-stone-900 dark:text-stone-100',
  stroke = 2,
  fill = false,
  animateOnClick = false,
  className,
}) => {
  const Icon = ICONS[name];

  const animateOnClickClass = animateOnClick
    ? ' transform transition-all duration-200 ease-in-out active:scale-[0.8] '
    : '';

  return (
    <div className={`${color} ${className} ${animateOnClickClass}`}>
      <Icon
        name={name}
        size={size}
        color={'currentColor'}
        stroke={stroke}
        fill={fill ? 'currentColor' : 'none'}
      />
    </div>
  );
};

export default Icon;
