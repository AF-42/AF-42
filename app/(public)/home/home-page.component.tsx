import { Badge } from '@/components/ui/badge';

export default function HomePage() {
    return (
        <div className='min-h-screen bg-black text-white'>
            {/* Hero Section */}
            <section className='relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]'></div>
                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32'>
                    <div className='text-center'>
                        <div className='flex flex-col items-center justify-center mb-5'>
                            <h1 className='text-3xl text-center sm:text-4xl md:text-5xl font-semibold tracking-tighter hover:text-cyan-400 transition-all duration-200 flex flex-row items-baseline font-source-code-pro'>
                                <span className='bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent'>
                                    AFTER
                                </span>
                                <span className='text-white'>-42</span>
                                <span className='text-xs sm:text-sm text-gray-400 pl-2'>
                                    Beta
                                </span>
                            </h1>
                        </div>
                        <Badge
                            variant='outline'
                            className='mb-8 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-sm'
                        >
                            🚀 AI-Powered Hiring Platform
                        </Badge>
                        <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-8'>
                            <span className='text-white'>
                                Discover and hire
                                <br /> the best 42 developers with ease.
                            </span>
                        </h1>
                        <p className='text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed italic'>
                            The smartest companies will hire more software
                            engineers, <br />
                            not fewer, as AI develops.&quot;
                            <br />- Thomas Dohmke, CEO of GitHub
                        </p>
                        <p className='text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed'>
                            COMING SOON
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
