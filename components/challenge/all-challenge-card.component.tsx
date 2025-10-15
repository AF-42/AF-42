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
import * as print from '@/lib/print-helpers';

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
        <Card className='group border border-gray-200/60 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300/60 overflow-hidden'>
            <CardHeader className='border-b border-gray-200/40 bg-gradient-to-r from-gray-50/50 to-white/80 backdrop-blur-sm p-6'>
                <div className='flex items-start gap-4'>
                    <div className='bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex aspect-square size-12 items-center justify-center rounded-xl shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200'>
                        <Code className='size-6' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <CardTitle className='text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200'>
                            {challenge.challenge_name || 'Untitled Challenge'}
                        </CardTitle>
                        <div className='flex flex-wrap gap-2'>
                            <Badge
                                variant='outline'
                                className={`text-xs px-3 py-1.5 font-medium ${statusConfig.color} border-0 shadow-sm`}
                            >
                                <StatusIcon className='size-3 mr-1.5' />
                                {statusConfig.label}
                            </Badge>
                            <Badge
                                variant='outline'
                                className={`text-xs px-3 py-1.5 font-medium ${difficultyConfig.color} border-0 shadow-sm`}
                            >
                                <Award className='size-3 mr-1.5' />
                                {difficultyConfig.label}
                            </Badge>
                            {challenge.challenge_industry && (
                                <Badge
                                    variant='outline'
                                    className='text-xs px-3 py-1.5 font-medium border-0 shadow-sm bg-blue-50 text-blue-700'
                                >
                                    <Target className='size-3 mr-1.5' />
                                    {challenge.challenge_industry}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Challenge Details */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg'>
                            <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Calendar className='size-4 text-blue-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Challenge Type
                                </p>
                                <p className='text-sm font-semibold text-gray-900 truncate'>
                                    {challenge.challenge_type ||
                                        'Not specified'}
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg'>
                            <div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Globe className='size-4 text-emerald-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Publication Status
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

                        {challenge.github_url && (
                            <div className='flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg'>
                                <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                    <Github className='size-4 text-gray-600' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-600'>
                                        Repository
                                    </p>
                                    <a
                                        href={challenge.github_url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm font-semibold text-blue-600 hover:text-blue-700 truncate block'
                                    >
                                        View on GitHub →
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Challenge Stats */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg'>
                            <div className='w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <CheckCircle2 className='size-4 text-amber-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Requirements
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                    {challenge.challenge_requirements?.length ||
                                        0}{' '}
                                    items
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg'>
                            <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Clock className='size-4 text-purple-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-600'>
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
            </CardContent>

            <CardFooter className='border-t border-gray-200/40 bg-gradient-to-r from-gray-50/30 to-white/50 p-6'>
                <div className='flex flex-col sm:flex-row gap-3 w-full'>
                    <Link
                        href={`/challenge/${challenge.id}`}
                        className='flex-1'
                    >
                        <Button
                            variant='outline'
                            className='w-full justify-center sm:justify-start border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 font-medium'
                        >
                            <Eye className='size-4 mr-2' />
                            View Challenge
                        </Button>
                    </Link>
                    <Link
                        href={`/challenge/${challenge.id}/edit`}
                        className='flex-1'
                    >
                        <Button
                            variant='outline'
                            className='w-full justify-center sm:justify-start border-gray-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all duration-200 font-medium'
                        >
                            <Edit3 className='size-4 mr-2' />
                            Edit Challenge
                        </Button>
                    </Link>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='flex-1 sm:flex-none justify-center sm:justify-start border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50/50 transition-all duration-200 font-medium'
                                disabled={isDeleting}
                            >
                                <Trash2 className='size-4 mr-2' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md bg-white border border-gray-200 shadow-xl'>
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
                                    <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                                        <Trash2 className='size-4 text-red-600' />
                                    </div>
                                    Delete Challenge
                                </DialogTitle>
                                <DialogDescription className='pt-3 text-gray-600 leading-relaxed'>
                                    Are you sure you want to delete "
                                    <span className='font-medium text-gray-900'>
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
                                    className='w-full sm:w-auto border-gray-200 hover:border-gray-300'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 shadow-sm'
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
