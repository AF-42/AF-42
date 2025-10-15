import { challengeService } from '@/backend/services/challenge.service';
import { AllChallengeCardComponent } from '@/components/challenge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Plus,
    Code2,
    Sparkles,
    TrendingUp,
    Users,
    Calendar,
} from 'lucide-react';
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
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]'></div>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_50%)]'></div>

            {/* Main content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <div className='w-full max-w-7xl mx-auto space-y-8'>
                    {/* Header Section */}
                    <div className='text-center space-y-6'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg mb-4'>
                            <Code2 className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'>
                            Challenge Management
                        </h1>
                        <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                            Create, manage, and track your technical challenges
                            with professional-grade tools
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <Code2 className='w-5 h-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>
                                        Total Challenges
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {totalChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                    <TrendingUp className='w-5 h-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>
                                        Published
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {publishedChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center'>
                                    <Calendar className='w-5 h-5 text-amber-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-gray-600'>
                                        Drafts
                                    </p>
                                    <p className='text-2xl font-bold text-gray-900'>
                                        {draftChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 shadow-sm'>
                        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
                            <div className='flex flex-col sm:flex-row gap-4 flex-1'>
                                <div className='relative flex-1 max-w-md'>
                                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                                    <Input
                                        placeholder='Search challenges...'
                                        className='pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='border-gray-200 hover:border-gray-300'
                                    >
                                        <Filter className='w-4 h-4 mr-2' />
                                        Filter
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='border-gray-200 hover:border-gray-300'
                                    >
                                        <Badge
                                            variant='secondary'
                                            className='mr-2'
                                        >
                                            All
                                        </Badge>
                                        Status
                                    </Button>
                                </div>
                            </div>
                            <Link href='/challenge/generate'>
                                <Button className='bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'>
                                    <Plus className='w-4 h-4 mr-2' />
                                    Create Challenge
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Challenges Grid */}
                    <div className='space-y-6'>
                        {challenges.length > 0 ? (
                            <div className='grid gap-6'>
                                {challenges.map((challenge) => (
                                    <AllChallengeCardComponent
                                        key={challenge.id}
                                        {...challenge}
                                    />
                                ))}
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
