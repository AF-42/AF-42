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
        <div className='min-h-screen relative'>
            {/* Main content */}

            <div className='w-full space-y-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <div className='w-full max-w-7xl mx-auto space-y-8'>
                    {/* Header Section */}
                    <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between'>
                        {/* Main content section */}
                        <div className='flex-1 min-w-0 space-y-6'>
                            {/* Icon and title section */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                                <div className='relative group'>
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-cyan-400 via-cyan-700 to-cyan-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Code2 className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        Challenges
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        Create, manage, and track your technical
                                        challenges with professional-grade tools
                                    </p>
                                </div>
                            </div>

                            {/* Stats or additional info section */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        Active Challenges
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-emerald-700'>
                                        Published
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200'>
                                    <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-amber-700'>
                                        Drafts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Link href='/challenge/generate' className='block'>
                                <Button className='cursor-pointer w-full text-sm sm:w-auto h-9 sm:h-10 sm:px-8 bg-cyan-600 text-white shadow-xl hover:shadow-2xl hover:bg-cyan-700 transition-all duration-300 font-semibold sm:text-base group'>
                                    <Plus className='w-5 h-5 sm:w-6 sm:h-6 sm:mr-3 group-hover:scale-110 transition-transform duration-200' />
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
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6'>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <Code2 className='size-4 sm:size-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Total Challenges
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {totalChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                    <TrendingUp className='size-4 sm:size-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Published
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {publishedChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-amber-100 rounded-lg flex items-center justify-center'>
                                    <Calendar className='size-4 sm:size-5 text-amber-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Drafts
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
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
                                <ScrollArea className='h-[500px]'>
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
                                <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-12 max-w-lg mx-auto shadow-sm'>
                                    <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                                        <Sparkles className='w-10 h-10 text-gray-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                        Ready to Create Your First Challenge?
                                    </h3>
                                    <p className='text-gray-600 mb-8 leading-relaxed'>
                                        Start building technical challenges that
                                        will help you evaluate candidates
                                        effectively. Our AI-powered generator
                                        makes it easy to create professional
                                        assessments.
                                    </p>
                                    <Link href='/challenge/generate'>
                                        <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'>
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
