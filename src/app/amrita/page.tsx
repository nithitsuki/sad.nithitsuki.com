import { Title } from '@/components/Title';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Link from 'next/link';

export default function page() {
  return (
    <div>
      <div className='min-h-screen flex flex-col'>
        <BackgroundGrid />
        <div className="flex justify-start mt-6 mb-2 px-6">
          <Link
            href="/"
            className="inline-flex items-center px-3 py-1 rounded-lg bg-[var(--background)] text-[var(--color-primary)] hover:bg-[var(--color-bg-accent-hover)] transition-colors shadow"
          >
            ← Home
          </Link>
        </div>
        <Title title="Amrita Extension" className='opacity-100 !text-[var(--color-primary)]' />
        <p className='mt-2 mb-4 text-center text-[var(--color-text-secondary)]'>Automatically get your latest attendance!</p>
        <div className='max-w-4xl mx-auto px-6 space-y-8'>
          <div className='bg-[var(--color-bg-card)]/90 backdrop-blur-md rounded-xl p-6 border border-[var(--color-border)] shadow-lg'>
            <h3 className='text-2xl font-semibold mb-4 text-[var(--color-primary)]'>💻 Laptop Installation</h3>
            <div className='space-y-2'>
              <p className='text-[var(--color-text)]'>Get the extension for your browser:</p>
              <div className='flex flex-wrap gap-3'>
                <a href='https://addons.mozilla.org/en-US/firefox/addon/amrita-attendance-fetcher/'
                  className='inline-flex items-center px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg transition-colors shadow'>
                  Firefox
                </a>
                <a href='https://microsoftedge.microsoft.com/addons/detail/amrita-attendance-fetcher/eeccbjbcoakpcknafgkaopfhlhckknnm'
                  className='inline-flex items-center px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors shadow'>
                  Edge
                </a>
              </div>
              <p>
                📖 <a href='https://github.com/nithitsuki/attendance-grabber?tab=readme-ov-file#quick-start'
                  className='text-[var(--color-link)] hover:text-[var(--color-link-hover)] underline'>
                  Quick start guide
                </a>
              </p>
            </div>
          </div>

          <div className='bg-[var(--color-bg-card)]/90 backdrop-blur-md rounded-xl p-6 border border-[var(--color-border)] shadow-lg'>
            <h3 className='text-2xl font-semibold mb-4 text-[var(--color-primary)]'>📱 Mobile Installation</h3>
            <div className='space-y-3'>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium text-[var(--color-text)]'>Step 1:</span>
                <a href='https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=en_IN'
                  className='inline-flex items-center px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg transition-colors w-fit shadow'>
                  Install Firefox from Play Store
                </a>
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium text-[var(--color-text)]'>Step 2:</span>
                <a href='https://addons.mozilla.org/en-US/firefox/addon/amrita-attendance-fetcher/'
                  className='inline-flex items-center px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg transition-colors w-fit shadow'>
                  Get Firefox Extension
                </a>
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium text-[var(--color-text)]'>Step 3:</span>
                <a href='https://github.com/nithitsuki/attendance-grabber?tab=readme-ov-file#quick-start'
                  className='text-[var(--color-link)] hover:text-[var(--color-link-hover)] underline'>
                  📖 Quick start guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}