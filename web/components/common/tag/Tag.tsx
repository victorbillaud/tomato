import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { Icon } from '../icon';
import { ITag, tagsConfig } from './index';

export const Tag: FunctionComponent<ITag> = ({
  text,
  color,
  size = 'small',
  className,
  icon,
  ...props
}: ITag) => {
  const sizeConfig = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const iconConfig = {
    small: 18,
    medium: 22,
    large: 24,
  };

  const containerClass = classNames(
    'w-fit rounded-full flex flex-row items-center justify-center gap-1',
    'bg-opacity-10',
    'border-1',
    'm-0 px-2 py-1',
    'capitalize brightness-200 font-medium',
    tagsConfig[color].textColor,
    tagsConfig[color].bgColor,
    sizeConfig[size],
    className
  );

  return (
    <span className={containerClass} {...props}>
      {icon && (
        <Icon
          size={iconConfig[size]}
          name={icon}
          color={tagsConfig[color].iconColor}
        />
      )}
      {text}
    </span>
  );
};
