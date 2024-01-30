import * as RadixAccordion from '@/components/radix/Accordion';
import classNames from 'classnames';
import React from 'react';
import { Icon } from '../icon';
import { Text } from '../text';

interface IAccordionProps {
  items: {
    title: string;
    content: string;
  }[];
}

export const Accordion = ({ items }: IAccordionProps) => {
  return (
    <RadixAccordion.Root
      className='w-full rounded-lg shadow-sm'
      type='multiple'
    >
      {items.map((item, index) => (
        <AccordionItem value={index.toString()} key={index}>
          <AccordionTrigger>
            <Text variant='subtitle' weight={500}>
              {item.title}
            </Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text variant='body'>{item.content}</Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </RadixAccordion.Root>
  );
};

interface IAccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RadixAccordion.AccordionItemProps {
  children: React.ReactNode;
}

const AccordionItem = React.forwardRef<HTMLDivElement, IAccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <RadixAccordion.Item
      className={classNames(
        'border border-stone-200 bg-stone-100 dark:bg-stone-900 border-opacity-50 first:rounded-t-lg last:rounded-b-lg dark:border-stone-900',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </RadixAccordion.Item>
  )
);

AccordionItem.displayName = 'AccordionItem';

interface IAccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    RadixAccordion.AccordionTriggerProps {
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  IAccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <RadixAccordion.Header className='flex'>
    <RadixAccordion.Trigger
      className={classNames(
        'group flex w-full items-center justify-between border-opacity-50 px-5 py-3 text-left text-[15px] font-medium text-stone-500 last:border-0 focus:outline-none',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <Icon name='chevron-down' className='transform group-hover:rotate-180' />
    </RadixAccordion.Trigger>
  </RadixAccordion.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

interface IAccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    RadixAccordion.AccordionContentProps {
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  IAccordionContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <RadixAccordion.Content
    className={classNames(
      'text-mauve11 dark:bg-stone-800 bg-stone-50 overflow-hidden text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className='px-5 py-[15px]'>{children}</div>
  </RadixAccordion.Content>
));

AccordionContent.displayName = 'AccordionContent';
