import { Button } from '@/components/common/button';
import { InputText } from '@/components/common/input/InputText';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';

// Storybook
export default async function Index() {
  return (
    <div className='animate-in flex w-full flex-col gap-5 px-3 opacity-0'>
      <Text variant={'h1'} className='text-center'>
        UI/Theme
      </Text>
      <div className='flex flex-wrap gap-10'>
        <div className='flex flex-col justify-end space-y-8'>
          <Button variant={'primary'} text='Click me' />
          <Button variant={'secondary'} text='Click me' />
          <Button variant={'tertiary'} text='Click me' />
        </div>
        <div className='flex flex-col justify-end space-y-8'>
          <Button variant={'primary'} disabled text='Click me' />
          <Button variant={'secondary'} disabled text='Click me' />
          <Button variant={'tertiary'} disabled text='Click me' />
        </div>
        <div className='flex flex-col justify-end space-y-8'>
          <StyledLink href={'/ui'} text='Link' variant='primary' />
          <StyledLink href={'/ui'} text='Link' variant='secondary' />
          <StyledLink href={'/ui'} text='Link' variant='tertiary' />
        </div>
        <div className='flex flex-col justify-end space-y-8'>
          <StyledLink href={'/ui'} text='Link' variant='primary' disabled />
          <StyledLink href={'/ui'} text='Link' variant='secondary' disabled />
          <StyledLink href={'/ui'} text='Link' variant='tertiary' disabled />
        </div>
        <div className='flex flex-col space-y-3'>
          <InputText labelText='Email' type='email' />
          <InputText labelText='Password' type='password' />
          <InputText labelText='Email' type='email' error='Error' />
        </div>
      </div>
    </div>
  );
}
