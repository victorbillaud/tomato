import classNames from 'classnames';
import { FunctionComponent } from 'react';
import { ITextProps, textConfig } from './index';

export const Text: FunctionComponent<ITextProps> = ({
  children,
  weight,
  variant,
  color,
  className,
  ...props
}: ITextProps) => {
  // this line doesn't work in the client, find something better for build the string
  const colorClass = `text-stone-900 dark:text-stone-100`;

  const weightClass = {
    100: 'font-thin',
    200: 'font-light',
    300: 'font-normal',
    400: 'font-medium',
    500: 'font-semibold',
    600: 'font-bold',
    700: 'font-extrabold',
  };

  const weightVariantClass = {
    h1: 'font-bold',
    h2: 'font-bold',
    h3: 'font-bold',
    h4: 'font-semibold',
    title: 'font-semibold',
    subtitle: 'font-semibold',
    body: 'font-normal',
    caption: 'font-normal',
    overline: 'font-normal',
    none: 'font-normal',
  };

  const classNameString = classNames(
    `${color ? color : colorClass}`,
    `${textConfig[variant]}`,
    `${weight ? weightClass[weight] : weightVariantClass[variant]}`,
    'transition-all',
    className
  );

  if (variant === 'h1') {
    return (
      <h1 className={classNameString} {...props}>
        {children}
      </h1>
    );
  }

  if (variant === 'h2') {
    return (
      <h2 className={classNameString} {...props}>
        {children}
      </h2>
    );
  }

  if (variant === 'h3') {
    return (
      <h3 className={classNameString} {...props}>
        {children}
      </h3>
    );
  }

  if (variant == 'body') {
    return (
      <p className={`mx-0 my-0 ${classNameString}`} {...props}>
        {children}
      </p>
    );
  }

  return (
    <span className={`${classNameString}`} {...props}>
      {children}
    </span>
  );
};
