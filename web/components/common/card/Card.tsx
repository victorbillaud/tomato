import React from 'react';

export interface ILayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, ILayoutProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        className={`rounded-md border border-stone-300 bg-stone-200 shadow-sm dark:border-stone-700 dark:bg-stone-900 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
