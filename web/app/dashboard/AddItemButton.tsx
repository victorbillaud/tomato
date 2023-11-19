'use client';

import { ILinkProps, StyledLink } from '@/components/common/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IAddItemLinkProps extends ILinkProps {}

export const AddItemLink = (props: IAddItemLinkProps) => {
  const [linkDisabled, setLinkDisabled] = useState(false);
  const pathname = usePathname();
  const disabledPrefix = ['/dashboard/item/create/'];

  useEffect(() => {
    if (disabledPrefix.some((prefix) => pathname.startsWith(prefix))) {
      setLinkDisabled(true);
    } else {
      setLinkDisabled(false);
    }
  }, [pathname]);

  return <StyledLink disabled={linkDisabled} {...props} />;
};
