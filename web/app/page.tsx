import { Icon } from '@/components/common/icon';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';

export default async function Index() {
  return (
    <div className='animate-in flex w-full flex-col'>
      <section className='my-12 flex w-full items-center px-6 sm:px-10'>
        <div className='flex w-full flex-col items-center justify-center gap-8'>
          <Text variant='h1' className='text-left'>
            Facile à perdre, encore plus
            <span className='text-primary-600'> facile à rendre&nbsp;!</span>
          </Text>
          <Text variant='h1' className='text-left'>
            Retrouvez vos objets égarés, et vivez la joie de rendre à
            quelqu&apos;un son bien précieux.
          </Text>
        </div>
        <div className='hidden h-full w-full items-end justify-center sm:flex'>
          <StyledLink
            href={'/login'}
            icon='chevron-right'
            text='Login'
            variant='primary'
            size='large'
          />
        </div>
      </section>

      <section className='my-12 flex w-full flex-col items-center px-6 sm:px-10'>
        <div className='my-12 flex w-full items-center justify-center'>
          <Text variant='h1' className='text-center'>
            Comment ça marche&nbsp;?
          </Text>
        </div>
        <div className='grid grid-cols-1 items-center gap-4 sm:my-12 sm:gap-8 lg:grid-cols-3'>
          <div className='flex h-full flex-col items-center justify-between sm:gap-4 md:flex-row lg:flex-col'>
            <div className='flex flex-1 flex-col items-center gap-2 text-center'>
              <Text variant='h3' className='text-center align-middle'>
                Vous{' '}
                <span className='text-primary-600'> trouvez un objet </span>{' '}
                floqué d&apos;un QRCode Tomato
              </Text>
              <Text variant='subtitle' className='text-center align-middle'>
                Peeetite description j&apos;ai pas d&apos;idée
              </Text>
            </div>
            <Icon
              name='eye'
              size={150}
              stroke={1}
              color='text-primary-600'
              className='flex flex-1 justify-center opacity-90'
            />
          </div>
          <div className='flex h-full flex-col items-center justify-between sm:gap-4 md:flex-row-reverse lg:flex-col'>
            <div className='flex flex-1 flex-col items-center gap-2 text-center'>
              <Text variant='h3' className='text-center align-middle'>
                Vous{' '}
                <span className='text-primary-600'> scannez simplement </span>{' '}
                ce QRCode avec votre smartphone
              </Text>
              <Text variant='subtitle' className='text-center align-middle'>
                Que vous ayez l&apos;application Tomato installée ou non
              </Text>
            </div>
            <Icon
              name='qrcode'
              size={150}
              color='text-primary-600'
              className='flex flex-1 justify-center opacity-90'
              stroke={1}
            />
          </div>
          <div className='flex h-full flex-col items-center justify-between sm:gap-4 md:flex-row lg:flex-col'>
            <div className='flex flex-1 flex-col items-center gap-2 text-center'>
              <Text variant='h3' className='text-center align-middle'>
                Vous êtes{' '}
                <span className='text-primary-600'> mis en contact </span>{' '}
                directement avec son propriétaire
              </Text>
              <Text variant='subtitle' className='text-center align-middle'>
                Sans renseigner la moindre information personnelle
              </Text>
            </div>
            <Icon
              name='message-circle'
              size={150}
              color='text-primary-600'
              className='flex flex-1 justify-center opacity-90'
              stroke={1}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
