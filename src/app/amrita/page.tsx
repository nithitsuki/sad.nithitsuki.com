import { Title } from '@/components/Title';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Link from 'next/link';

export default function page() {
  return (
    <div className='min-h-screen flex flex-col'>
      <BackgroundGrid />

      <div className='flex justify-start mt-6 mb-2 px-6'>
        <Link
          href='/'
          className='inline-flex items-center px-3 py-1 rounded-lg bg-[var(--background)] text-[var(--color-primary)] hover:bg-[var(--color-bg-accent-hover)] transition-colors shadow'
        >
          Home
        </Link>
      </div>

      <Title title='Amrita Extension' className='opacity-100 !text-[var(--color-primary)]' />
      <p className='mt-2 mb-6 text-center text-[var(--color-text-secondary)]'>Install once and fetch attendance quickly.</p>

      <div className='max-w-3xl mx-auto px-6 pb-10 space-y-5'>
        <section className='bg-[var(--color-bg-card)]/90 backdrop-blur-md rounded-xl p-6 border border-[var(--color-border)] shadow-lg'>
          <h2 className='text-xl font-semibold text-[var(--color-primary)] mb-4'>Browser extension</h2>
          <div className='flex flex-wrap gap-3'>
            <a
              href='https://addons.mozilla.org/en-US/firefox/addon/amrita-attendance-fetcher/'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity'
            >
              Firefox Add-ons
            </a>
            <a
              href='https://microsoftedge.microsoft.com/addons/detail/amrita-attendance-fetcher/eeccbjbcoakpcknafgkaopfhlhckknnm'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity'
            >
              Microsoft Edge Add-ons
            </a>
            <a
              href='https://chromewebstore.google.com/detail/amrita-attendance-fetcher/ckgljenieoaihjnblblljojohgdpbbke'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity'
            >
              Chrome Web Store
            </a>
          </div>
        </section>

        <section className='bg-[var(--color-bg-card)]/90 backdrop-blur-md rounded-xl p-6 border border-[var(--color-border)] shadow-lg'>
          <h2 className='text-xl font-semibold text-[var(--color-primary)] mb-2'>Phone users</h2>
          <p className='text-[var(--color-text)]'>Install Firefox on your phone, then install the extension from Firefox Add-ons.</p>
        </section>
      </div>
    </div>
  );
}