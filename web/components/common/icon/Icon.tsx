import { FunctionComponent } from 'react';
import ICONS from './constant';
import { IIconProps } from './types';

export const Icon: FunctionComponent<IIconProps> = ({
  name,
  size = 24,
  color = 'black',
  stroke = 2,
  className,
}) => {
  const Icon = ICONS[name];

  return (
    <div className={`${color} ${className}`}>
      <Icon name={name} size={size} color={'currentColor'} stroke={stroke} />
    </div>
  );
};

export default Icon;
