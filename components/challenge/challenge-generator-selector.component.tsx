import { Sparkles } from 'lucide-react';
import { TaskGeneratorFormFromFileUpload } from '@/components/challenge';
import { Card, CardContent } from '@/components/ui/card';

export function ChallengeGeneratorSelectorComponent() {
    return (
        <div className='w-full space-y-8 mx-auto max-w-7xl pt-3'>
            {/* Header Section */}
            <div className='flex-1 min-w-0 space-y-6'>
                {/* Icon and title section */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                    <div className='relative group'>
                        <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-cyan-400 via-cyan-700 to-cyan-900 rounded-xl shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                            <Sparkles className='size-5 sm:size-6 text-white' />
                        </div>
                        <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                            <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                        </div>
                    </div>

                    <div className='flex-1 min-w-0'>
                        <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text  leading-tight'>
                            Challenge Generator
                        </h1>
                        <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                            Transform job postings into comprehensive technical
                            challenges with our advanced AI platform.
                        </p>
                    </div>
                </div>

                {/* Main Generator Card */}
                <Card className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                    <CardContent className='p-6'>
                        <TaskGeneratorFormFromFileUpload />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
