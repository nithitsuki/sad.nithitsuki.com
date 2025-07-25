import { Title } from '@/components/Title';
import { BackgroundGrid } from '@/components/BackgroundGrid';

export default function page() {
  return (
    <div>
      <div className='min-h-screen flex flex-col'>
        <BackgroundGrid />
        <Title title="Amrita Extension" className='opacity-100 !text-pink-700' />
        <p className='mt-2 mb-4 text-center'>Automatically get your latest attendance!</p>
        <div className='max-w-4xl mx-auto px-6 space-y-8'>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20'>
            <h3 className='text-2xl font-semibold mb-4 text-pink-600'>💻 Laptop Installation</h3>
            <div className='space-y-2'>
              <p>Get the extension for your browser:</p>
              <div className='flex flex-wrap gap-3'>
                <a href='https://addons.mozilla.org/en-US/firefox/addon/amrita-attendance-fetcher/'
                  className='inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors'>
                  Firefox
                </a>
                <a href='https://microsoftedge.microsoft.com/addons/detail/amrita-attendance-fetcher/eeccbjbcoakpcknafgkaopfhlhckknnm'
                  className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
                  Edge
                </a>
              </div>
              <p>
                📖 <a href='https://github.com/nithitsuki/attendance-grabber?tab=readme-ov-file#quick-start'
                  className='text-pink-400 hover:text-pink-300 underline'>
                  Quick start guide
                </a>
              </p>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20'>
            <h3 className='text-2xl font-semibold mb-4 text-pink-600'>📱 Mobile Installation</h3>
            <div className='space-y-3'>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium'>Step 1:</span>
                <a href='https://play.google.com/store/apps/details?id=org.mozilla.firefox&hl=en_IN'
                  className='inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors w-fit'>
                  Install Firefox from Play Store
                </a>
              </div>
              <div className='flex flex-col space-y-2'>
                <span className='font-medium'>Step 2:</span>
                <a href='https://addons.mozilla.org/en-US/firefox/addon/amrita-attendance-fetcher/'
                  className='inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors w-fit'>
                  Get Firefox Extension
                </a>
              </div>
              <p>
                <div className='flex flex-col space-y-2'>
                  <span className='font-medium'>Step 3:</span>
                  <a href='https://github.com/nithitsuki/attendance-grabber?tab=readme-ov-file#quick-start'
                    className='text-pink-400 hover:text-pink-300 underline'>
                    📖 Quick start guide
                  </a>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};