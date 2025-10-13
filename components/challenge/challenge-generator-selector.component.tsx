import { Sparkles } from 'lucide-react';
import { TaskGeneratorFormFromFileUpload } from '@/components/challenge';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export function ChallengeGeneratorSelectorComponent() {
    return (
        <div className='w-full max-w-7xl mx-auto'>
            {/* Header Section */}
            <div className='space-y-4 flex flex-row items-start justify-start'>
                <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-lg'>
                    <Sparkles className='size-6' />
                </div>
                <div className='flex flex-col items-start justify-start gap-2 pl-4'>
                    <div className='flex flex-col items-start justify-start pb-6'>
                        <h1 className='text-3xl font-bold text-gray-900'>
                            Challenge Generator
                        </h1>
                        <p className='text-xl text-gray-600 font-medium'>
                            AI-Powered Technical Assessment Creator
                        </p>
                    </div>
                    <p className='text-lg text-gray-600 leading-relaxed max-w-3xl'>
                        Transform job postings into comprehensive technical
                        challenges with our advanced AI platform.
                    </p>
                </div>
            </div>

            {/* Main Generator Card */}
            <Card className='backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200'>
                <CardContent className='p-6'>
                    <TaskGeneratorFormFromFileUpload />
                </CardContent>
            </Card>
        </div>
    );
}
