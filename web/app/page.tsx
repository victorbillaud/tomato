import { Icon } from '@/components/common/icon';
import { Text } from '@/components/common/text';
import Card from '@/components/qrcode/Card';

export default async function Index() {
  return (
    <div className='animate-in flex w-full flex-col'>
      <section className='flex w-full justify-center px-6 py-12 sm:px-10 sm:py-12'>
        <div className='flex w-full max-w-5xl items-center'>
          <div className='flex w-full flex-col items-start gap-16'>
            <Text variant='h1'>
              Easy to lose, even
              <span className='text-primary-600'> easier to return&nbsp;!</span>
            </Text>
            <Text variant='h1'>
              Find yout lost objects, and live the joy of returning someone
              their precious ones.
            </Text>
          </div>

          <div className='hidden h-full w-full items-end justify-center gap-4 p-12 sm:flex'>
            <Card image='/qrcode_home.png' />
          </div>
        </div>
      </section>

      <section className='flex w-full justify-center bg-primary-500 px-6 py-12 opacity-90 sm:px-10 sm:py-20'>
        <div className='flex w-full max-w-5xl flex-col items-center'>
          <div className='flex w-full items-center justify-center pb-12'>
            <Text variant='h1' className='text-left' color='text-white'>
              What for&nbsp;?
            </Text>
          </div>

          <div className='flex w-full flex-col gap-8 sm:py-12'>
            <Text variant='h3' className='text-left' color='text-white'>
              Make the return of lost objects so simple, that it becomes a
              pleasure. Help kind people to get in touch with the owners of lost
              objects.
            </Text>

            <div className='grid grid-cols-1 justify-around gap-8 sm:grid-cols-2 sm:gap-4'>
              <div className='flex justify-center'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-4 pb-6'>
                    <Icon
                      name='eye-search'
                      size={50}
                      color='text-white'
                      stroke={1.5}
                      className='flex justify-center'
                    />
                    <Text
                      variant='h3'
                      className='text-center'
                      color='text-white'
                    >
                      Found an object ?
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
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
                    <Text variant='h3' color='text-white'>
                      No application to download
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      No account to create
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      Anonymous
                    </Text>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center justify-center gap-4 pb-6'>
                    <Icon
                      name='user-question'
                      size={50}
                      color='text-white'
                      stroke={1.5}
                      className='flex justify-center'
                    />
                    <Text
                      variant='h3'
                      className='text-center'
                      color='text-white'
                    >
                      Owner ?
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      A simple application
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      A complete web interface
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      A caring community
                    </Text>
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Icon
                      name='circle-check-filled'
                      size={28}
                      color='text-white'
                      stroke={1}
                    />
                    <Text variant='h3' color='text-white'>
                      Anonymous
                    </Text>
                  </div>
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
              How does it work&nbsp;?
            </Text>
          </div>

          <div className='grid grid-cols-1 items-center gap-4 sm:gap-8 sm:py-12 lg:grid-cols-3'>
            <div className='flex h-full flex-col items-center justify-between sm:gap-4 md:flex-row lg:flex-col'>
              <div className='flex flex-1 flex-col items-center gap-2 text-center'>
                <Text variant='h3' className='text-center align-middle'>
                  You{' '}
                  <span className='text-primary-600'> found an object </span>{' '}
                  with a Tomato QRCode
                </Text>
                <Text variant='subtitle' className='text-center align-middle'>
                  Pull out your smartphone
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
                  You <span className='text-primary-600'> simply scan </span>{' '}
                  this QRCode with your smartphone
                </Text>
                <Text variant='subtitle' className='text-center align-middle'>
                  Whether you have the Tomato app installed or not
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
                  You are put{' '}
                  <span className='text-primary-600'> in direct contact </span>{' '}
                  with its owner
                </Text>
                <Text variant='subtitle' className='text-center align-middle'>
                  Without providing any personal information
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

      <section className='flex w-full justify-center bg-primary-500 px-6 py-12 opacity-90 sm:px-10 sm:py-20'>
        <div className='flex w-full max-w-5xl flex-col items-center'>
          <div className='flex w-full items-center justify-center pb-12'>
            <Text variant='h1' className='text-left' color='text-white'>
              Your feedback&nbsp;!
            </Text>
          </div>

          <div className='flex w-full flex-col gap-8 sm:py-12'>
            <div className='grid w-full grid-cols-1 justify-around gap-8 sm:grid-cols-3'>
              <div className='flex h-fit flex-col gap-6 rounded-lg bg-white px-6 py-8'>
                <div className='flex'>
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon
                    name='star-half-filled'
                    size={25}
                    color='text-yellow-300'
                    stroke={1}
                  />
                </div>
                <div className='flex flex-col gap-4'>
                  <Text
                    variant='body'
                    className='flex items-center text-left'
                    color='text-black'
                  >
                    Tomato is a game-changer&nbsp;! Found my lost wallet in no
                    time with this simple and effective platform. Thanks&nbsp;!
                  </Text>
                  <Text
                    variant='subtitle'
                    className='text-right'
                    color='text-black'
                  >
                    Sophie. D
                  </Text>
                </div>
              </div>
              <div className='flex h-fit flex-col gap-6 rounded-lg bg-white px-6 py-8'>
                <div className='flex'>
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                </div>
                <div className='flex flex-col gap-4'>
                  <Text
                    variant='body'
                    className='flex items-center text-left'
                    color='text-black'
                  >
                    Loving Tomato&apos;s web interface and the super-helpful
                    community. It&apos;s a breeze to use&nbsp;!
                  </Text>
                  <Text
                    variant='subtitle'
                    className='text-right'
                    color='text-black'
                  >
                    Baptise L.
                  </Text>
                </div>
              </div>
              <div className='flex h-fit flex-col gap-6 rounded-lg bg-white px-6 py-8'>
                <div className='flex'>
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                  <Icon name='star-filled' size={25} color='text-yellow-300' />
                </div>
                <div className='flex flex-col gap-4'>
                  <Text
                    variant='body'
                    className='flex items-center text-left'
                    color='text-black'
                  >
                    Used Tomato to return a lost phone from the metro. Quick and
                    anonymous process made it a seamless experience. I will
                    surely use it for myself&nbsp;!
                  </Text>
                  <Text
                    variant='subtitle'
                    className='text-right'
                    color='text-black'
                  >
                    Jeanne. M
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
