import { getChallengeByIdAction } from '@/app/actions/get-challenge-by-id.action';
import {
    ArrowLeft,
    MapPin,
    Trophy,
    Clock,
    Users,
    CheckCircle,
    BookOpen,
    Target,
    Package,
    Star,
    Settings,
    Shield,
    Wrench,
    XCircle,
    ExternalLink,
    Edit3,
    Globe,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChallengeNotFound } from '@/components/challenge/challenge-not-found.component';
import {
    extractAllSections,
    parseRequirementsSubsections,
    getTechDocumentationUrl,
    parseDeliverablesList,
    parseEvaluationRubricList,
    stripSubmissionInstructions,
} from '@/lib/challenge-parser';
import Link from 'next/link';

export default async function ChallengePage({
    params,
}: {
    params: Promise<{ 'challenge-id': string }>;
}) {
    const resolvedParams = await params;
    const result = await getChallengeByIdAction(resolvedParams['challenge-id']);

    if (!result.success || !result.data || result.data.length === 0) {
        return <ChallengeNotFound />;
    }

    const challenge = result.data[0];

    // Get difficulty color scheme
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get category color scheme
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Frontend: 'bg-blue-100 text-blue-800 border-blue-200',
            Backend: 'bg-purple-100 text-purple-800 border-purple-200',
            'Full Stack': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            DevOps: 'bg-orange-100 text-orange-800 border-orange-200',
            'AI/ML': 'bg-pink-100 text-pink-800 border-pink-200',
            Mobile: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            Database: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            Security: 'bg-red-100 text-red-800 border-red-200',
            Blockchain: 'bg-amber-100 text-amber-800 border-amber-200',
            'Game Dev': 'bg-violet-100 text-violet-800 border-violet-200',
            Cloud: 'bg-sky-100 text-sky-800 border-sky-200',
            IoT: 'bg-teal-100 text-teal-800 border-teal-200',
            Testing: 'bg-lime-100 text-lime-800 border-lime-200',
            Algorithms: 'bg-rose-100 text-rose-800 border-rose-200',
            Systems: 'bg-slate-100 text-slate-800 border-slate-200',
            Fintech: 'bg-green-100 text-green-800 border-green-200',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Get status color scheme
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'paused':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'closed':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'upcoming':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        }
    };

    return (
        <div className='flex flex-1 flex-col min-h-screen relative overflow-hidden'>
            {/* Content with relative positioning */}
            <div className='relative z-10 flex flex-1 flex-col min-h-screen overflow-hidden'>
                {/* Enhanced Main Content - Responsive Layout */}
                <div className='flex flex-1 flex-col overflow-hidden'>
                    <div className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8'>
                        <div className='max-w-7xl mx-auto'>
                            {/* Enhanced Back Button */}
                            <Link href='/challenge/all'>
                                <Button
                                    variant='ghost'
                                    className='mb-4 sm:mb-6 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors duration-200 w-full sm:w-auto'
                                >
                                    <ArrowLeft className='w-4 h-4 mr-2' />
                                    Back to Challenges
                                </Button>
                            </Link>

                            {/* Full Width Challenge Header */}
                            <div className='bg-white rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200 mb-4 sm:mb-6 lg:mb-8'>
                                <div className='p-4 sm:p-6 lg:p-8'>
                                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                                        {/* Left side - Title and badges */}
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex flex-wrap items-center gap-3'>
                                                <Badge
                                                    className={`${getDifficultyColor(challenge.challenge_difficulty)} border border-cyan-400/50 text-sm`}
                                                >
                                                    <Target className='w-6 h-6' />
                                                    {
                                                        challenge.challenge_difficulty
                                                    }
                                                </Badge>
                                                <Badge
                                                    className={`${getCategoryColor(challenge.challenge_industry)} border border-cyan-400/50 text-sm`}
                                                >
                                                    <Target className='w-6 h-6' />
                                                    {
                                                        challenge.challenge_industry
                                                    }
                                                </Badge>
                                            </div>

                                            <div className='space-y-3'>
                                                <h1 className='text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight'>
                                                    {challenge.challenge_name}
                                                </h1>
                                                <div className='h-1 w-20 sm:w-24 bg-cyan-600 rounded-sm'></div>
                                            </div>
                                        </div>

                                        {/* Right side - Stats and Action */}
                                        <div className='flex flex-col gap-4 lg:items-end'>
                                            <div className='flex flex-wrap gap-3'>
                                                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-md border border-slate-200'>
                                                    <Target className='w-4 h-4 text-slate-600 flex-shrink-0' />
                                                    <span className='text-slate-700'>
                                                        Challenge ID:{' '}
                                                        <span className='font-semibold text-slate-700'>
                                                            {challenge.id}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${getStatusColor(challenge.challenge_status)}`}
                                                >
                                                    <Users className='w-4 h-4 flex-shrink-0' />
                                                    <span>
                                                        Status:{' '}
                                                        {
                                                            challenge.challenge_status
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
                                                <Link
                                                    href={`/challenge/${challenge.id}/edit`}
                                                >
                                                    <Button
                                                        variant='outline'
                                                        className='hover:border-cyan-400 hover:text-white hover:bg-cyan-600 flex-1 sm:flex-none'
                                                        size='sm'
                                                    >
                                                        <Edit3 className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                                                        <span className='hidden sm:inline'>
                                                            Edit Challenge
                                                        </span>
                                                        <span className='sm:hidden'>
                                                            Edit
                                                        </span>
                                                    </Button>
                                                </Link>
                                                {/* TODO: Add invite team review button when team review is implemented */}
                                                {/* <Button
                                                    variant='outline'
                                                    className='hover:border-cyan-400 hover:text-cyan-600 flex-1 sm:flex-none'
                                                    size='sm'
                                                >
                                                    <Users className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                                                    <span className='hidden sm:inline'>
                                                        Invite Team Review
                                                    </span>
                                                    <span className='sm:hidden'>
                                                        Review
                                                    </span>
                                                </Button> */}
                                                <Button
                                                    className='bg-cyan-600 hover:bg-cyan-700 text-white transition-colors duration-200 flex-1 sm:flex-none disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed'
                                                    size='sm'
                                                >
                                                    <Globe className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                                                    <span className='hidden sm:inline'>
                                                        Publish Challenge
                                                    </span>
                                                    <span className='sm:hidden'>
                                                        Publish
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Two Column Layout - Sidebar and Main Content */}
                            <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
                                {/* Sidebar - Additional Info */}
                                <div className='lg:col-span-1 space-y-4 sm:space-y-6 order-1 lg:order-1'>
                                    {/* Additional Information */}
                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200'>
                                        <div className='p-4 sm:p-6'>
                                            <div className='mb-6'>
                                                <div className='flex items-center gap-3 mb-3'>
                                                    <div className='p-2 bg-slate-500 rounded-md'>
                                                        <Clock className='w-5 h-5 text-white' />
                                                    </div>
                                                    <h3 className='text-lg font-bold text-slate-900'>
                                                        Additional Information
                                                    </h3>
                                                </div>
                                                <div className='h-0.5 w-12 bg-slate-600 rounded-sm'></div>
                                            </div>
                                            <div className='space-y-6'>
                                                <div className='flex flex-col gap-4'>
                                                    <div className='flex items-center gap-3 p-4 bg-blue-50 rounded-md border border-blue-200'>
                                                        <Users className='w-5 h-5 text-blue-600 flex-shrink-0' />
                                                        <span className='text-sm font-medium text-slate-700'>
                                                            Individual Challenge
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-3 p-4 bg-cyan-50 rounded-md border border-cyan-200'>
                                                        <Target className='w-5 h-5 text-cyan-600 flex-shrink-0' />
                                                        <span className='text-sm font-medium text-slate-700'>
                                                            Submission Required
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className='h-px bg-slate-200'></div>

                                                <div className='p-4 bg-cyan-50 rounded-md border border-cyan-200'>
                                                    <p className='text-sm text-slate-700 leading-relaxed'>
                                                        <span className='font-semibold text-cyan-700'>
                                                            Note:
                                                        </span>{' '}
                                                        This challenge is part
                                                        of our global tech
                                                        skills assessment
                                                        program. Complete it to
                                                        showcase your abilities
                                                        to potential employers
                                                        and advance in your
                                                        career journey.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content - Structured Challenge Sections */}
                                <div className='lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 order-2 lg:order-2'>
                                    {(() => {
                                        const sections = extractAllSections(
                                            challenge.challenge_description,
                                        );

                                        return (
                                            <>
                                                {/* Problem Overview */}
                                                {sections.problemOverview && (
                                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-200'>
                                                        <div className='p-4 sm:p-6'>
                                                            <div className='mb-6'>
                                                                <div className='flex items-center gap-3 mb-3'>
                                                                    <div className='p-2 bg-blue-500 rounded-md'>
                                                                        <BookOpen className='w-5 h-5 text-white' />
                                                                    </div>
                                                                    <h2 className='text-xl font-bold text-slate-900'>
                                                                        Problem
                                                                        Overview
                                                                    </h2>
                                                                </div>
                                                                <div className='h-0.5 w-16 bg-blue-600 rounded-sm'></div>
                                                            </div>
                                                            <div className='prose prose-slate max-w-none'>
                                                                <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                    {
                                                                        sections.problemOverview
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Problem Statement */}
                                                {sections.problemStatement && (
                                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200'>
                                                        <div className='p-4 sm:p-6'>
                                                            <div className='mb-6'>
                                                                <div className='flex items-center gap-3 mb-3'>
                                                                    <div className='p-2 bg-cyan-500 rounded-md'>
                                                                        <Target className='w-5 h-5 text-white' />
                                                                    </div>
                                                                    <h2 className='text-xl font-bold text-slate-900'>
                                                                        Problem
                                                                        Statement
                                                                    </h2>
                                                                </div>
                                                                <div className='h-0.5 w-16 bg-cyan-600 rounded-sm'></div>
                                                            </div>
                                                            <div className='prose prose-slate max-w-none'>
                                                                <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                    {
                                                                        sections.problemStatement
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Requirements */}
                                                {sections.requirements && (
                                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors duration-200'>
                                                        <div className='p-4 sm:p-6'>
                                                            <div className='mb-6'>
                                                                <div className='flex items-center gap-3 mb-3'>
                                                                    <div className='p-2 bg-emerald-500 rounded-md'>
                                                                        <CheckCircle className='w-5 h-5 text-white' />
                                                                    </div>
                                                                    <h3 className='text-lg font-bold text-slate-900'>
                                                                        Requirements
                                                                    </h3>
                                                                </div>
                                                                <div className='h-0.5 w-12 bg-emerald-600 rounded-sm'></div>
                                                            </div>

                                                            {(() => {
                                                                const requirementsSubsections =
                                                                    parseRequirementsSubsections(
                                                                        sections.requirements,
                                                                    );

                                                                return (
                                                                    <div className='space-y-6'>
                                                                        {/* Functional Requirements */}
                                                                        {requirementsSubsections
                                                                            .functionalRequirements
                                                                            .length >
                                                                            0 && (
                                                                            <div className='space-y-3'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='p-1.5 bg-blue-100 rounded-md'>
                                                                                        <Settings className='w-4 h-4 text-blue-600' />
                                                                                    </div>
                                                                                    <h4 className='text-md font-semibold text-slate-800'>
                                                                                        Functional
                                                                                        Requirements
                                                                                    </h4>
                                                                                </div>
                                                                                <div className='ml-6 space-y-2'>
                                                                                    {requirementsSubsections.functionalRequirements.map(
                                                                                        (
                                                                                            req,
                                                                                            index,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className='flex items-start gap-3'
                                                                                            >
                                                                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                                <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                                    {
                                                                                                        req
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Non-Functional Requirements */}
                                                                        {requirementsSubsections
                                                                            .nonFunctionalRequirements
                                                                            .length >
                                                                            0 && (
                                                                            <div className='space-y-3'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='p-1.5 bg-purple-100 rounded-md'>
                                                                                        <Shield className='w-4 h-4 text-purple-600' />
                                                                                    </div>
                                                                                    <h4 className='text-md font-semibold text-slate-800'>
                                                                                        Non-Functional
                                                                                        Requirements
                                                                                    </h4>
                                                                                </div>
                                                                                <div className='ml-6 space-y-2'>
                                                                                    {requirementsSubsections.nonFunctionalRequirements.map(
                                                                                        (
                                                                                            req,
                                                                                            index,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className='flex items-start gap-3'
                                                                                            >
                                                                                                <div className='w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                                <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                                    {
                                                                                                        req
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Constraints */}
                                                                        {requirementsSubsections
                                                                            .constraints
                                                                            .length >
                                                                            0 && (
                                                                            <div className='space-y-3'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='p-1.5 bg-orange-100 rounded-md'>
                                                                                        <XCircle className='w-4 h-4 text-orange-600' />
                                                                                    </div>
                                                                                    <h4 className='text-md font-semibold text-slate-800'>
                                                                                        Constraints
                                                                                    </h4>
                                                                                </div>
                                                                                <div className='ml-6 space-y-2'>
                                                                                    {requirementsSubsections.constraints.map(
                                                                                        (
                                                                                            constraint,
                                                                                            index,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className='flex items-start gap-3'
                                                                                            >
                                                                                                <div className='w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                                <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                                    {
                                                                                                        constraint
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Allowed Tools */}
                                                                        {requirementsSubsections
                                                                            .allowedTools
                                                                            .length >
                                                                            0 && (
                                                                            <div className='space-y-3'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='p-1.5 bg-green-100 rounded-md'>
                                                                                        <Wrench className='w-4 h-4 text-green-600' />
                                                                                    </div>
                                                                                    <h4 className='text-md font-semibold text-slate-800'>
                                                                                        Allowed
                                                                                        Tools
                                                                                    </h4>
                                                                                </div>
                                                                                <div className='ml-4 sm:ml-6 space-y-2'>
                                                                                    <ScrollArea className='h-[200px] sm:h-[250px] lg:h-[300px]'>
                                                                                        <div className='pr-2'>
                                                                                            {challenge.challenge_requirements.map(
                                                                                                (
                                                                                                    requirement,
                                                                                                    index,
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        className='flex items-start gap-2  rounded-lg hover:bg-green-50/50 transition-colors duration-200'
                                                                                                    >
                                                                                                        <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                                        <div className='flex-1 min-w-0'>
                                                                                                            {(() => {
                                                                                                                const docUrl =
                                                                                                                    getTechDocumentationUrl(
                                                                                                                        requirement.name,
                                                                                                                    );

                                                                                                                return (
                                                                                                                    <div className='break-words'>
                                                                                                                        {docUrl ? (
                                                                                                                            <Link
                                                                                                                                href={
                                                                                                                                    docUrl
                                                                                                                                }
                                                                                                                                target='_blank'
                                                                                                                                rel='noopener noreferrer'
                                                                                                                                className='text-sm sm:text-base text-green-600 hover:text-green-700 hover:underline transition-colors duration-200 font-medium'
                                                                                                                            >
                                                                                                                                {
                                                                                                                                    requirement.name
                                                                                                                                }
                                                                                                                                <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 inline ml-1' />
                                                                                                                            </Link>
                                                                                                                        ) : (
                                                                                                                            <span className='text-sm sm:text-base text-slate-700 font-medium'>
                                                                                                                                {
                                                                                                                                    requirement.name
                                                                                                                                }
                                                                                                                            </span>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })()}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ),
                                                                                            )}
                                                                                        </div>
                                                                                    </ScrollArea>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* External Services */}
                                                                        {requirementsSubsections
                                                                            .externalServices
                                                                            .length >
                                                                            0 && (
                                                                            <div className='space-y-3'>
                                                                                <div className='flex items-center gap-2'>
                                                                                    <div className='p-1.5 bg-indigo-100 rounded-md'>
                                                                                        <ExternalLink className='w-4 h-4 text-indigo-600' />
                                                                                    </div>
                                                                                    <h4 className='text-md font-semibold text-slate-800'>
                                                                                        External
                                                                                        Services
                                                                                    </h4>
                                                                                </div>
                                                                                <div className='ml-6 space-y-2'>
                                                                                    {requirementsSubsections.externalServices.map(
                                                                                        (
                                                                                            service,
                                                                                            index,
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                className='flex items-start gap-3'
                                                                                            >
                                                                                                <div className='w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                                <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                                    {
                                                                                                        service
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Fallback: If no subsections were parsed, show the raw text */}
                                                                        {requirementsSubsections
                                                                            .functionalRequirements
                                                                            .length ===
                                                                            0 &&
                                                                            requirementsSubsections
                                                                                .nonFunctionalRequirements
                                                                                .length ===
                                                                                0 &&
                                                                            requirementsSubsections
                                                                                .constraints
                                                                                .length ===
                                                                                0 &&
                                                                            requirementsSubsections
                                                                                .allowedTools
                                                                                .length ===
                                                                                0 &&
                                                                            requirementsSubsections
                                                                                .disallowedTools
                                                                                .length ===
                                                                                0 &&
                                                                            requirementsSubsections
                                                                                .externalServices
                                                                                .length ===
                                                                                0 && (
                                                                                <div className='prose prose-slate max-w-none'>
                                                                                    <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                                        {
                                                                                            sections.requirements
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Deliverables */}
                                                {sections.deliverables && (
                                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-colors duration-200'>
                                                        <div className='p-4 sm:p-6'>
                                                            <div className='mb-6'>
                                                                <div className='flex items-center gap-3 mb-3'>
                                                                    <div className='p-2 bg-purple-500 rounded-md'>
                                                                        <Package className='w-5 h-5 text-white' />
                                                                    </div>
                                                                    <h3 className='text-lg font-bold text-slate-900'>
                                                                        Deliverables
                                                                    </h3>
                                                                </div>
                                                                <div className='h-0.5 w-12 bg-purple-600 rounded-sm'></div>
                                                            </div>

                                                            {(() => {
                                                                const deliverablesList =
                                                                    parseDeliverablesList(
                                                                        sections.deliverables,
                                                                    );

                                                                return (
                                                                    <div className='space-y-3'>
                                                                        {deliverablesList.length >
                                                                        0 ? (
                                                                            deliverablesList.map(
                                                                                (
                                                                                    deliverable,
                                                                                    index,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className='flex items-start gap-3'
                                                                                    >
                                                                                        <div className='w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                        <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                            {
                                                                                                deliverable
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <div className='prose prose-slate max-w-none'>
                                                                                <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                                    {stripSubmissionInstructions(
                                                                                        sections.deliverables,
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Evaluation Rubric */}
                                                {sections.evaluationRubric && (
                                                    <div className='bg-white rounded-lg border border-gray-200 hover:border-amber-200 transition-colors duration-200'>
                                                        <div className='p-4 sm:p-6'>
                                                            <div className='mb-6'>
                                                                <div className='flex items-center gap-3 mb-3'>
                                                                    <div className='p-2 bg-amber-500 rounded-md'>
                                                                        <Star className='w-5 h-5 text-white' />
                                                                    </div>
                                                                    <h3 className='text-lg font-bold text-slate-900'>
                                                                        Evaluation
                                                                        Rubric
                                                                    </h3>
                                                                </div>
                                                                <div className='h-0.5 w-12 bg-amber-600 rounded-sm'></div>
                                                            </div>

                                                            {(() => {
                                                                const evaluationCriteria =
                                                                    parseEvaluationRubricList(
                                                                        sections.evaluationRubric,
                                                                    );

                                                                return (
                                                                    <div className='space-y-3'>
                                                                        {evaluationCriteria.length >
                                                                        0 ? (
                                                                            evaluationCriteria.map(
                                                                                (
                                                                                    criterion,
                                                                                    index,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className='flex items-start gap-3'
                                                                                    >
                                                                                        <div className='w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
                                                                                        <span className='text-sm text-slate-700 leading-relaxed'>
                                                                                            {
                                                                                                criterion
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )
                                                                        ) : (
                                                                            <div className='prose prose-slate max-w-none'>
                                                                                <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                                    {
                                                                                        sections.evaluationRubric
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
