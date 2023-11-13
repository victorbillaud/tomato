import { FunctionComponent } from 'react';
import ICONS from './constant';
import { IIconProps } from './types';

export const Icon: FunctionComponent<IIconProps> = ({
  name,
  size = 24,
  color = 'black',
  stroke = 2,
}) => {
  const Icon = ICONS[name];

  return <Icon name={name} size={size} color={color} stroke={stroke} />;
};

export default Icon;
