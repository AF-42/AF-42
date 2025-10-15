import { challengeService } from '@/backend/services/challenge.service';
import { AllChallengeCardComponent } from '@/components/challenge';
import { Button } from '@/components/ui/button';
import { Plus, Code2, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export default async function AllChallengesPage() {
    const challenges = await challengeService.getAllChallenges();

    // Calculate stats
    const totalChallenges = challenges.length;
    const publishedChallenges = challenges.filter((c) => c.is_published).length;
    const draftChallenges = challenges.filter(
        (c) => c.challenge_status === 'draft',
    ).length;

    return (
        <div className='max-h-screen relative bg-gray-50'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]'></div>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.03),transparent_50%)]'></div>

            {/* Main content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <div className='w-full max-w-7xl mx-auto space-y-8'>
                    {/* Header Section */}
                    <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between'>
                        {/* Main content section */}
                        <div className='flex-1 min-w-0 space-y-6'>
                            {/* Icon and title section */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                                <div className='relative group'>
                                    <div className='inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-blue-600 shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Code2 className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 shadow-lg flex items-center justify-center'>
                                        <div className='w-3 h-3 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-gray-900'>
                                        Challenge Management
                                    </h1>
                                    <p className='mt-2 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl text-gray-600'>
                                        Create, manage, and track your technical
                                        challenges with professional-grade tools
                                    </p>
                                </div>
                            </div>

                            {/* Stats or additional info section */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 rounded-lg border bg-white border-gray-200'>
                                    <div className='w-2 h-2 rounded-full bg-blue-600'></div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Active Challenges
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 rounded-lg border bg-white border-gray-200'>
                                    <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Published
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 rounded-lg border bg-white border-gray-200'>
                                    <div className='w-2 h-2 rounded-full bg-yellow-500'></div>
                                    <span className='text-sm font-medium text-gray-700'>
                                        Drafts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Link href='/challenge/generate' className='block'>
                                <Button className='cursor-pointer w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base sm:text-lg group'>
                                    <Plus className='w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-200' />
                                    <span className='hidden sm:inline'>
                                        Generate New Challenge
                                    </span>
                                    <span className='sm:hidden'>
                                        New Challenge
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
                        <div className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white border-gray-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100'>
                                    <Code2 className='w-5 h-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-500'>
                                        Total Challenges
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {totalChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white border-gray-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-green-100'>
                                    <TrendingUp className='w-5 h-5 text-green-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-500'>
                                        Published
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {publishedChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white border-gray-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-100'>
                                    <Calendar className='w-5 h-5 text-yellow-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-500'>
                                        Drafts
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {draftChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Challenges Grid */}
                    <div className='space-y-6'>
                        {challenges.length > 0 ? (
                            <div className='grid gap-6 overflow-y-auto'>
                                <ScrollArea className='max-h-[1000px]'>
                                    {challenges.map((challenge) => (
                                        <AllChallengeCardComponent
                                            key={challenge.id}
                                            {...challenge}
                                        />
                                    ))}
                                </ScrollArea>
                            </div>
                        ) : (
                            <div className='text-center py-16'>
                                <div className='border rounded-2xl p-12 max-w-lg mx-auto shadow-sm bg-white border-gray-200'>
                                    <div className='w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gray-100 border border-gray-200'>
                                        <Sparkles className='w-10 h-10 text-gray-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold mb-3 text-gray-900'>
                                        Ready to Create Your First Challenge?
                                    </h3>
                                    <p className='mb-8 leading-relaxed text-gray-600'>
                                        Start building technical challenges that
                                        will help you evaluate candidates
                                        effectively. Our AI-powered generator
                                        makes it easy to create professional
                                        assessments.
                                    </p>
                                    <Link href='/challenge/generate'>
                                        <Button className='px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-white bg-blue-600 hover:bg-blue-700'>
                                            <Plus className='w-5 h-5 mr-2' />
                                            Create Your First Challenge
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
