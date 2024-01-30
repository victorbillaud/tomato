import { Icon } from '@/components/common/icon';
import { CustomImage } from '@/components/common/image';
import { Text } from '@/components/common/text';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-6 px-3'>
      <div className='flex max-w-3xl flex-col gap-10 px-3'>
        <Text
          variant='h1'
          color='text-primary-600'
          className='py-4 text-center'
        >
          About us
        </Text>
        <Text variant='h3' weight={400} className='text-left'>
          We are a team of 5 French engineering students at{' '}
          <Link
            href='https://www.efrei.fr/'
            className='underline underline-offset-2 hover:font-bold'
          >
            EFREI Paris
          </Link>
          .
        </Text>
        <div className='flex items-center gap-6'>
          <Icon
            name='calendar-month'
            size={30}
            stroke={1.5}
            color='text-primary-600'
          />
          <Text variant='subtitle' weight={400} className='text-left'>
            We created Tomato as part of a final year project. We imagined and
            developed this project in 3 months, starting in November 2023.
          </Text>
        </div>
        <div className='flex items-center gap-6'>
          <Icon name='send' size={30} stroke={1.5} color='text-primary-600' />
          <Text variant='subtitle' weight={400} className='text-left'>
            If you want to know more about each of us, click on our beautiful
            faces below ! You can also send a message to the team on{' '}
            <Link
              href={'/contact'}
              className='underline underline-offset-2 hover:font-bold'
            >
              this page
            </Link>
            .
          </Text>
        </div>
        <div className='flex items-center gap-6'>
          <Icon name='github' size={30} stroke={1.5} color='text-primary-600' />
          <Text variant='subtitle' weight={400} className='text-left'>
            You can find the source code of this project{' '}
            <Link
              href={'https://github.com/victorbillaud/tomato'}
              className='underline underline-offset-2 hover:font-bold'
            >
              here
            </Link>
            .
          </Text>
        </div>
        <div className='flex items-center gap-6'>
          <Icon name='heart' size={30} stroke={1.5} color='text-primary-600' />
          <Text variant='subtitle' weight={400} className='text-left'>
            We hope you will enjoy using Tomato as much as we enjoy creating it
            !
          </Text>
        </div>
      </div>
      <div className='my-10 flex flex-wrap justify-center gap-10'>
        <div className='flex gap-10'>
          <Link
            href={'https://www.linkedin.com/in/victorbillaud/'}
            className='flex flex-col gap-4'
          >
            <CustomImage
              src='/about-us/victor.jpg'
              alt='victor'
              title='Victor BILLAUD'
              rounded='full'
              width={150}
              height={150}
            />
            <Text variant='subtitle' weight={400} className='text-center'>
              Victor
            </Text>
          </Link>
          <Link
            href={'https://www.linkedin.com/in/gendron-thomas/'}
            className='flex flex-col gap-4'
          >
            <CustomImage
              src='/about-us/thomas.jpg'
              alt='thomas'
              title='Thomas GENDRON'
              rounded='full'
              width={150}
              height={150}
            />
            <Text variant='subtitle' weight={400} className='text-center'>
              Thomas
            </Text>
          </Link>
        </div>
        <Link
          href={'https://www.linkedin.com/in/arthur-pigeon/'}
          className='flex flex-col gap-4'
        >
          <CustomImage
            src='/about-us/arthur.jpg'
            alt='arthur'
            title='Arthur PIGEON'
            rounded='full'
            width={150}
            height={150}
          />
          <Text variant='subtitle' weight={400} className='text-center'>
            Arthur
          </Text>
        </Link>
        <div className='flex gap-10'>
          <Link
            href={'https://www.linkedin.com/in/clovis-thouvenot-oudart/'}
            className='flex flex-col gap-4'
          >
            <CustomImage
              src='/about-us/clovis.jpg'
              alt='clovis'
              title='Clovis THOUVENOT-OUDART'
              rounded='full'
              width={150}
              height={150}
            />
            <Text variant='subtitle' weight={400} className='text-center'>
              Clovis
            </Text>
          </Link>
          <Link
            href={'https://www.linkedin.com/in/guillaumevdn/'}
            className='flex flex-col gap-4'
          >
            <CustomImage
              src='/about-us/guillaume.jpg'
              alt='guillaume'
              title='Guillaume VANDENNEUCKER'
              rounded='full'
              width={150}
              height={150}
            />
            <Text variant='subtitle' weight={400} className='text-center'>
              Guillaume
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
}
