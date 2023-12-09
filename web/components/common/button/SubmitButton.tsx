'use client';

import { Button, IButtonProps } from '.';
// @ts-ignore
import { useFormStatus } from 'react-dom';

type IFormButtonProps = IButtonProps;

export function SubmitButton(props: IFormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' isLoader={pending} disabled={pending} {...props} />
  );
}
