import { Icon } from '@/components/common/icon';
import { StyledLink } from '@/components/common/link';
import { Text } from '@/components/common/text';

export default async function Index() {
  return (
    <div className='animate-in flex w-full flex-col'>
      <section className='flex w-full justify-center px-6 py-12 sm:px-10 sm:py-20'>
        <div className='flex max-w-5xl items-center'>
          <div className='flex w-full flex-col items-center gap-8'>
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
        </div>
      </section>

      <section className='flex w-full justify-center bg-primary-500 px-6 py-12 sm:px-10 sm:py-20'>
        <div className='flex max-w-5xl flex-col items-center'>
          <div className='flex w-full items-center justify-center pb-12'>
            <Text variant='h1' className='text-left text-white'>
              L&apos;objectif&nbsp;?
            </Text>
          </div>

          <div className='flex w-full flex-col gap-8 sm:py-12'>
            <Text variant='h3' className='text-left text-white'>
              Rendre la restitution d&apos;objets si simple, que ça en devient
              un plaisir. Aider les personnes bienveillantes à rentrer en
              contact avec les propriétaires d&apos;objets égarés.
            </Text>

            <div className='flex justify-around'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4 pb-6'>
                  <Icon
                    name='eye-search'
                    size={50}
                    color='text-white'
                    stroke={1.5}
                    className='flex justify-center'
                  />
                  <Text variant='h3' className='text-center text-white'>
                    Objet trouvé ?
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Simple
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Pas d&apos;application à télécharger
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Pas de compte à créer
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Anonyme
                  </Text>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4 pb-6'>
                  <Icon
                    name='user-question'
                    size={50}
                    color='text-white'
                    stroke={1.5}
                    className='flex justify-center'
                  />
                  <Text variant='h3' className='text-center text-white'>
                    Propriétaire ?
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Une application simple
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Une interface web complète
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Une communauté bienveillante
                  </Text>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <Icon
                    name='circle-check-filled'
                    size={28}
                    color='text-white'
                    stroke={1}
                  />
                  <Text variant='h3' className='text-white'>
                    Anonyme
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='flex w-full justify-center px-6 py-12 sm:px-10 sm:py-20'>
        <div className='flex max-w-6xl flex-col items-center'>
          <div className='flex w-full items-center justify-center pb-12'>
            <Text variant='h1' className='text-center'>
              Comment ça marche&nbsp;?
            </Text>
          </div>

          <div className='grid grid-cols-1 items-center gap-4 sm:gap-8 sm:py-12 lg:grid-cols-3'>
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
                name='scan'
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
        </div>
      </section>
    </div>
  );
}
