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
        <div
            className='max-h-screen relative'
            style={{ backgroundColor: 'var(--color-background)' }}
        >
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,173,181,0.08),transparent_50%)]'></div>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,173,181,0.05),transparent_50%)]'></div>

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
                                    <div
                                        className='inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'
                                        style={{
                                            backgroundColor:
                                                'var(--color-primary)',
                                        }}
                                    >
                                        <Code2 className='w-8 h-8 sm:w-10 sm:h-10 text-white' />
                                    </div>
                                    <div
                                        className='absolute -top-1 -right-1 w-6 h-6 rounded-full shadow-lg flex items-center justify-center'
                                        style={{
                                            backgroundColor:
                                                'var(--color-hover)',
                                        }}
                                    >
                                        <div className='w-3 h-3 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1
                                        className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Challenge Management
                                    </h1>
                                    <p
                                        className='mt-2 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl'
                                        style={{
                                            color: 'var(--color-text)',
                                            opacity: 0.8,
                                        }}
                                    >
                                        Create, manage, and track your technical
                                        challenges with professional-grade tools
                                    </p>
                                </div>
                            </div>

                            {/* Stats or additional info section */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div
                                    className='flex items-center gap-2 px-3 py-2 rounded-lg border'
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div
                                        className='w-2 h-2 rounded-full'
                                        style={{
                                            backgroundColor:
                                                'var(--color-primary)',
                                        }}
                                    ></div>
                                    <span
                                        className='text-sm font-medium'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Active Challenges
                                    </span>
                                </div>
                                <div
                                    className='flex items-center gap-2 px-3 py-2 rounded-lg border'
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div
                                        className='w-2 h-2 rounded-full'
                                        style={{
                                            backgroundColor:
                                                'var(--color-hover)',
                                        }}
                                    ></div>
                                    <span
                                        className='text-sm font-medium'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Published
                                    </span>
                                </div>
                                <div
                                    className='flex items-center gap-2 px-3 py-2 rounded-lg border'
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div
                                        className='w-2 h-2 rounded-full'
                                        style={{
                                            backgroundColor:
                                                'var(--color-accent)',
                                            opacity: 0.7,
                                        }}
                                    ></div>
                                    <span
                                        className='text-sm font-medium'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Drafts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Link href='/challenge/generate' className='block'>
                                <Button
                                    className='cursor-pointer w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base sm:text-lg group'
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                    }}
                                >
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
                        <div
                            className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                            }}
                        >
                            <div className='flex items-center gap-3'>
                                <div
                                    className='w-10 h-10 rounded-lg flex items-center justify-center'
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                        opacity: 0.1,
                                    }}
                                >
                                    <Code2
                                        className='w-5 h-5'
                                        style={{
                                            color: 'var(--color-primary)',
                                        }}
                                    />
                                </div>
                                <div>
                                    <p
                                        className='text-sm font-medium'
                                        style={{
                                            color: 'var(--color-text)',
                                            opacity: 0.7,
                                        }}
                                    >
                                        Total Challenges
                                    </p>
                                    <p
                                        className='text-2xl font-bold'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {totalChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                            }}
                        >
                            <div className='flex items-center gap-3'>
                                <div
                                    className='w-10 h-10 rounded-lg flex items-center justify-center'
                                    style={{
                                        backgroundColor: 'var(--color-hover)',
                                        opacity: 0.1,
                                    }}
                                >
                                    <TrendingUp
                                        className='w-5 h-5'
                                        style={{ color: 'var(--color-hover)' }}
                                    />
                                </div>
                                <div>
                                    <p
                                        className='text-sm font-medium'
                                        style={{
                                            color: 'var(--color-text)',
                                            opacity: 0.7,
                                        }}
                                    >
                                        Published
                                    </p>
                                    <p
                                        className='text-2xl font-bold'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {publishedChallenges}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div
                            className='border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200'
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                            }}
                        >
                            <div className='flex items-center gap-3'>
                                <div
                                    className='w-10 h-10 rounded-lg flex items-center justify-center'
                                    style={{
                                        backgroundColor: 'var(--color-accent)',
                                        opacity: 0.1,
                                    }}
                                >
                                    <Calendar
                                        className='w-5 h-5'
                                        style={{ color: 'var(--color-accent)' }}
                                    />
                                </div>
                                <div>
                                    <p
                                        className='text-sm font-medium'
                                        style={{
                                            color: 'var(--color-text)',
                                            opacity: 0.7,
                                        }}
                                    >
                                        Drafts
                                    </p>
                                    <p
                                        className='text-2xl font-bold'
                                        style={{ color: 'var(--color-text)' }}
                                    >
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
                                <div
                                    className='border rounded-2xl p-12 max-w-lg mx-auto shadow-sm'
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        borderColor: 'var(--color-border)',
                                    }}
                                >
                                    <div
                                        className='w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6'
                                        style={{
                                            backgroundColor:
                                                'var(--color-surface)',
                                            border: `1px solid var(--color-border)`,
                                        }}
                                    >
                                        <Sparkles
                                            className='w-10 h-10'
                                            style={{
                                                color: 'var(--color-text)',
                                                opacity: 0.5,
                                            }}
                                        />
                                    </div>
                                    <h3
                                        className='text-xl font-semibold mb-3'
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        Ready to Create Your First Challenge?
                                    </h3>
                                    <p
                                        className='mb-8 leading-relaxed'
                                        style={{
                                            color: 'var(--color-text)',
                                            opacity: 0.8,
                                        }}
                                    >
                                        Start building technical challenges that
                                        will help you evaluate candidates
                                        effectively. Our AI-powered generator
                                        makes it easy to create professional
                                        assessments.
                                    </p>
                                    <Link href='/challenge/generate'>
                                        <Button
                                            className='px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-white'
                                            style={{
                                                backgroundColor:
                                                    'var(--color-primary)',
                                            }}
                                        >
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
