import { Text } from '@/components/common/text';

export default function PolicyPage() {
  return (
    <div className='flex w-full max-w-6xl flex-1 flex-col items-start justify-start gap-5 px-3'>
      <Text
        variant='h1'
        weight={700}
        color='text-primary-600'
        className='text-left'
      >
        Privacy Policy
      </Text>
      <Text variant='subtitle' weight={500} className='text-left'>
        Our Commitment to Privacy
      </Text>
      <Text variant='body' className='text-left'>
        Your privacy is important to us. To better protect your privacy we
        provide this notice explaining our online information practices and the
        choices you can make about the way your information is collected and
        used. To make this notice easy to find, we make it available on our
        homepage and at every point where personally identifiable information
        may be requested.
      </Text>
      <Text variant='subtitle' weight={500} className='text-left'>
        The Information We Collect
      </Text>
      <Text variant='body' className='text-left'>
        This notice applies to all information collected or submitted on the
        Tomato website. On some pages, you can order products, make requests,
        and register to create items. The types of personal information
        collected at these pages are:
      </Text>
      <ul className='list-inside list-disc text-left font-sans text-sm text-stone-900 dark:text-stone-100 md:text-base'>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
      </ul>
      <Text variant='subtitle' weight={500} className='text-left'>
        How We Use Information
      </Text>
      <Text variant='body' className='text-left'>
        We use the information you provide about yourself when placing an order
        only to complete that order. We do not share this information with
        outside parties except to the extent necessary to complete that order.
        We use return e-mail addresses to answer the e-mail we receive. Such
        addresses are not used for any other purpose and are not shared with
        outside parties. You can register with our website if you would like to
        receive our newsletter as well as updates on our new products and
        services. Information you submit on our website will not be used for
        this purpose unless you fill out the registration form. Finally, we
        never use or share the personally identifiable information provided to
        us online in ways unrelated to the ones described above without also
        providing you an opportunity to opt out or otherwise prohibit such
        unrelated uses.
      </Text>
      <Text variant='subtitle' weight={500} className='text-left'>
        Our Commitment to Data Security
      </Text>
      <Text variant='body' className='text-left'>
        To prevent unauthorized access, maintain data accuracy, and ensure the
        correct use of information, we have put in place appropriate physical,
        electronic, and managerial procedures to safeguard and secure the
        information we collect online.
      </Text>

      <Text variant='subtitle' weight={500} className='text-left'>
        Our Commitment to Children&apos;s Privacy
      </Text>
      <Text variant='body' className='text-left'>
        Protecting the privacy of the very young is especially important. For
        that reason, we never collect or maintain information at our website
        from those we actually know are under 13, and no part of our website is
        structured to attract anyone under 13.
      </Text>
      <Text variant='subtitle' weight={500} className='text-left'>
        How to Access or Correct Your Information
      </Text>
      <Text variant='body' className='text-left'>
        You can access all your personally identifiable information that we
        collect online and maintain by emailing us. To protect your privacy and
        security, we will take reasonable steps to verify your identity before
        granting access or making corrections. We use this procedure to better
        safeguard your information. You can correct factual errors in your
        personally identifiable information by sending us a request that
        credibly shows error.
      </Text>
    </div>
  );
}
