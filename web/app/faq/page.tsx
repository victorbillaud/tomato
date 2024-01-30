import { Accordion } from '@/components/common/accordion';
import { CustomImage } from '@/components/common/image';
import { Text } from '@/components/common/text';

export default function FaqPage() {
  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-center justify-start gap-5 px-3'>
      <CustomImage src='/tomato_green.png' alt='faq' width={150} height={150} />
      <Text
        variant='h1'
        weight={700}
        color='text-primary-600'
        className='text-center'
      >
        How can we help you?
      </Text>

      <Accordion
        items={[
          {
            title: 'What is Tomato?',
            content:
              'Tomato is a website where you can generate and print QR Codes to help you recover lost belongings such as pets, keys, electronics, and luggage. QRFind also tracks the location of each scan, making it even easier to recover your lost items.',
          },
          {
            title: 'How do I scan a QR Code?',
            content:
              'Depending on your device, you might already have a built-in QR Code reader or scanner. Open the camera app on your mobile phone and hold it over a Code for a few seconds until a notification pops up. If this doesn’t happen, check your settings and see if QR Code scanning is enabled. Still not working? Don’t worry, all you have to do now is install third-party QR Code readers from your app stores.',
          },
          {
            title: 'What happens when my QR Code is scanned?',
            content:
              'If your belongings are lost, anyone who finds them can scan the QR Code using their smartphone to be directed to a discussion board where they can leave a message for you. You will receive an email notification with the message and the location of the scan.',
          },
          {
            title:
              'What kind of information is shown when a QR Code is scanned?',
            content:
              'Every QR Code has a unique URL that leads to a discussion board where you can communicate with the person who scanned your Code.',
          },
          {
            title: 'Can I print the QR Codes myself?',
            content:
              'Yes! You can print the QR Codes yourself using a printer and a sheet of paper. You can also print them on stickers and attach them to your belongings.',
          },
          {
            title: 'Can I buy the QR Codes from you?',
            content:
              'Yes! We can print and ship the QR Codes to you. You can also buy them from our shop to get fancy stickers and tags.',
          },
          {
            title: 'How accurate are the scanned locations?',
            content:
              "It depends. When a user scans your QR Code, they will be asked to share their location. If they agree, you will receive a very accurate location. If they don't agree, we can still track their approximate location but with less accuracy.",
          },
          {
            title: 'How long are QR Codes valid for?',
            content:
              'QR Codes are valid for as long as you want and will never expire. The only instance where the Code might “expire” is when the link is changed or deleted, rendering it unusable.',
          },
        ]}
      />
    </div>
  );
}
