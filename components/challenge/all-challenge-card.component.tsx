'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type ChallengeType } from '@/types/challenge.type';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Eye,
    Edit3,
    Trash2,
    Calendar,
    Code,
    Target,
    Award,
    Globe,
    Github,
    Clock,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

// Helper functions for status and difficulty styling
const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'draft':
            return {
                icon: Clock,
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                label: 'Draft',
            };
        case 'published':
            return {
                icon: CheckCircle2,
                color: 'text-green-600 bg-green-50 border-green-200',
                label: 'Published',
            };
        case 'archived':
            return {
                icon: AlertCircle,
                color: 'text-gray-600 bg-gray-50 border-gray-200',
                label: 'Archived',
            };
        default:
            return {
                icon: Clock,
                color: 'text-gray-600 bg-gray-50 border-gray-200',
                label: status || 'Unknown',
            };
    }
};

const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
        case 'junior':
        case 'entry':
            return {
                color: 'text-green-600 bg-green-50 border-green-200',
                label: difficulty,
            };
        case 'mid':
        case 'mid-level':
        case 'intermediate':
            return {
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                label: difficulty,
            };
        case 'senior':
        case 'senior-level':
        case 'expert':
            return {
                color: 'text-red-600 bg-red-50 border-red-200',
                label: difficulty,
            };
        default:
            return {
                color: 'text-gray-600 bg-gray-50 border-gray-200',
                label: difficulty || 'Not specified',
            };
    }
};

export function AllChallengeCardComponent(challenge: ChallengeType) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const statusConfig = getStatusConfig(challenge.challenge_status);
    const difficultyConfig = getDifficultyConfig(
        challenge.challenge_difficulty,
    );
    const StatusIcon = statusConfig.icon;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/challenge/${challenge.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh the page to show updated list
                router.refresh();
            } else {
                console.error('Failed to delete challenge');
                // You might want to show a toast notification here
            }
        } catch (error) {
            console.error('Error deleting challenge:', error);
            // You might want to show a toast notification here
        } finally {
            setIsDeleting(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <Card className='group relative border-0 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden rounded-2xl'>
            <CardHeader className='relative p-4 sm:p-6 pb-3 sm:pb-4'>
                {/* Background gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30'></div>

                <div className='relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4'>
                    {/* Icon and status indicator */}
                    <div className='relative flex-shrink-0 self-center sm:self-start'>
                        <div className='bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'>
                            <Code className='size-4 sm:size-5' />
                        </div>
                        <div className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                            <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full'></div>
                        </div>
                    </div>

                    {/* Title and badges section */}
                    <div className='flex-1 min-w-0 space-y-2 sm:space-y-3 w-full'>
                        {/* Title section */}
                        <div className='text-center sm:text-left'>
                            <CardTitle className='text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 leading-tight break-words'>
                                {challenge.challenge_name ||
                                    'Untitled Challenge'}
                            </CardTitle>
                            <p className='text-xs text-gray-500 font-medium'>
                                Challenge ID: #{challenge.id}
                            </p>
                        </div>

                        {/* Badges section */}
                        <div className='flex flex-wrap justify-center sm:justify-start gap-2'>
                            <Badge
                                variant='outline'
                                className={`text-xs px-2.5 py-1 font-semibold ${statusConfig.color} border-0 shadow-sm rounded-full`}
                            >
                                <StatusIcon className='size-3 mr-1' />
                                {statusConfig.label}
                            </Badge>
                            <Badge
                                variant='outline'
                                className={`text-xs px-2.5 py-1 font-semibold ${difficultyConfig.color} border-0 shadow-sm rounded-full`}
                            >
                                <Award className='size-3 mr-1' />
                                {difficultyConfig.label}
                            </Badge>
                            {challenge.challenge_industry && (
                                <Badge
                                    variant='outline'
                                    className='text-xs px-2.5 py-1 font-semibold border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full'
                                >
                                    <Target className='size-3 mr-1' />
                                    {challenge.challenge_industry}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className='px-4 sm:px-6 py-3 sm:py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Challenge Information */}
                    <div className='space-y-3'>
                        <div className='group/item bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 hover:shadow-md transition-all duration-300'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'>
                                    <Calendar className='size-3.5 text-blue-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-medium text-gray-600'>
                                        Type
                                    </p>
                                    <p className='text-sm font-semibold text-gray-900 truncate'>
                                        {challenge.challenge_type ||
                                            'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='group/item bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 hover:shadow-md transition-all duration-300'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'>
                                    <Globe className='size-3.5 text-emerald-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-medium text-gray-600'>
                                        Status
                                    </p>
                                    <p
                                        className={`text-sm font-semibold ${
                                            challenge.is_published
                                                ? 'text-emerald-600'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {challenge.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {challenge.github_url && (
                            <div className='group/item bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 hover:shadow-md transition-all duration-300'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'>
                                        <Github className='size-3.5 text-gray-600' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs font-medium text-gray-600'>
                                            Repository
                                        </p>
                                        <a
                                            href={challenge.github_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm font-semibold text-blue-600 hover:text-blue-700 truncate block transition-colors duration-200'
                                        >
                                            View on GitHub →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Statistics */}
                    <div className='space-y-3'>
                        <div className='group/item bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 hover:shadow-md transition-all duration-300'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'>
                                    <CheckCircle2 className='size-3.5 text-amber-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-medium text-gray-600'>
                                        Requirements
                                    </p>
                                    <p className='text-lg font-bold text-gray-900'>
                                        {challenge.challenge_requirements
                                            ?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='group/item bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-3 hover:shadow-md transition-all duration-300'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'>
                                    <Clock className='size-3.5 text-purple-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-medium text-gray-600'>
                                        Created
                                    </p>
                                    <p className='text-sm font-semibold text-gray-900'>
                                        {challenge.created_at
                                            ? new Date(
                                                  challenge.created_at,
                                              ).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Action buttons section */}
            <CardFooter className='relative px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-50/50 via-white to-blue-50/30'>
                {/* Subtle border */}
                <div className='absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent'></div>

                <div className='flex flex-col sm:flex-row gap-3 w-full'>
                    <Link
                        href={`/challenge/${challenge.id}`}
                        className='flex-1 group/btn'
                    >
                        <Button
                            variant='outline'
                            className='w-full h-9 sm:h-10 justify-center sm:justify-start border-2 border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 font-semibold text-blue-700 group-hover/btn:scale-[1.02]'
                        >
                            <Eye className='size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                            View Challenge
                        </Button>
                    </Link>

                    <Link
                        href={`/challenge/${challenge.id}/edit`}
                        className='flex-1 group/btn'
                    >
                        <Button
                            variant='outline'
                            className='w-full h-9 sm:h-10 justify-center sm:justify-start border-2 border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 font-semibold text-emerald-700 group-hover/btn:scale-[1.02]'
                        >
                            <Edit3 className='size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                            Edit Challenge
                        </Button>
                    </Link>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='flex-1 sm:flex-none h-9 sm:h-10 justify-center sm:justify-start border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-300 hover:shadow-lg transition-all duration-300 font-semibold text-red-700 disabled:opacity-50 disabled:cursor-not-allowed group/btn'
                                disabled={isDeleting}
                            >
                                <Trash2 className='size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl'>
                            <DialogHeader className='pb-4'>
                                <DialogTitle className='flex items-center gap-3 text-xl font-bold text-gray-900'>
                                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                                        <Trash2 className='size-6 text-red-600' />
                                    </div>
                                    Delete Challenge
                                </DialogTitle>
                                <DialogDescription className='pt-4 text-gray-600 leading-relaxed text-base'>
                                    Are you sure you want to delete "
                                    <span className='font-semibold text-gray-900'>
                                        {challenge.challenge_name}
                                    </span>
                                    "? This action cannot be undone and will
                                    permanently remove the challenge and all
                                    associated data.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className='flex-col sm:flex-row gap-3 pt-6'>
                                <Button
                                    variant='outline'
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto h-11 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-semibold'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                                >
                                    {isDeleting
                                        ? 'Deleting...'
                                        : 'Delete Challenge'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    );
}
