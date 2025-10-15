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
        <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'>
            <CardHeader className='border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/95 backdrop-blur-sm p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                    <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-md flex-shrink-0'>
                        <Code className='size-5' />
                    </div>
                    <div className='flex-1 min-w-0'>
                        <CardTitle className='text-lg sm:text-xl font-semibold text-gray-900 truncate'>
                            {challenge.challenge_name || 'Untitled Challenge'}
                        </CardTitle>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            <Badge
                                variant='outline'
                                className={`text-sm px-3 py-1 ${statusConfig.color}`}
                            >
                                <StatusIcon className='size-3 mr-1' />
                                {statusConfig.label}
                            </Badge>
                            <Badge
                                variant='outline'
                                className={`text-sm px-3 py-1 ${difficultyConfig.color}`}
                            >
                                <Award className='size-3 mr-1' />
                                {difficultyConfig.label}
                            </Badge>
                            {challenge.challenge_industry && (
                                <Badge
                                    variant='outline'
                                    className='text-sm px-3 py-1 border-blue-400/50 text-blue-600 bg-blue-400/10'
                                >
                                    <Target className='size-3 mr-1' />
                                    {challenge.challenge_industry}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className='p-4 sm:p-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                    {/* Challenge Details */}
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Calendar className='size-4 text-gray-400' />
                            <span className='font-medium'>Type:</span>
                            <span>
                                {challenge.challenge_type || 'Not specified'}
                            </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Globe className='size-4 text-gray-400' />
                            <span className='font-medium'>Published:</span>
                            <span
                                className={
                                    challenge.is_published
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {challenge.is_published ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {challenge.github_url && (
                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                <Github className='size-4 text-gray-400' />
                                <span className='font-medium'>Repository:</span>
                                <a
                                    href={challenge.github_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-cyan-600 hover:text-cyan-700 truncate'
                                >
                                    View on GitHub
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Challenge Stats */}
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <CheckCircle2 className='size-4 text-gray-400' />
                            <span className='font-medium'>Requirements:</span>
                            <span>
                                {challenge.challenge_requirements?.length || 0}{' '}
                                items
                            </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Clock className='size-4 text-gray-400' />
                            <span className='font-medium'>Created:</span>
                            <span>
                                {challenge.created_at
                                    ? new Date(
                                          challenge.created_at,
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className='border-t border-gray-200/60 bg-gray-50/50 p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row gap-3 w-full'>
                    <Link
                        href={`/challenge/${challenge.id}`}
                        className='flex-1'
                    >
                        <Button
                            variant='outline'
                            className='w-full justify-center sm:justify-start hover:border-cyan-400 hover:text-cyan-600'
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
                            className='w-full justify-center sm:justify-start hover:border-cyan-400 hover:text-cyan-600'
                        >
                            <Edit3 className='size-4 mr-2' />
                            Edit Challenge
                        </Button>
                    </Link>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='flex-1 sm:flex-none justify-center sm:justify-start text-red-600 hover:text-red-700 hover:border-red-300'
                                disabled={isDeleting}
                            >
                                <Trash2 className='size-4 mr-2' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-md bg-white'>
                            <DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <Trash2 className='size-5 text-red-600' />
                                    Delete Challenge
                                </DialogTitle>
                                <DialogDescription className='pt-2 bg-white'>
                                    Are you sure you want to delete "
                                    {challenge.challenge_name}"? This action
                                    cannot be undone and will permanently remove
                                    the challenge.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className='flex-col sm:flex-row gap-2 pt-4 bg-white'>
                                <Button
                                    variant='outline'
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto bg-red-600 text-white hover:bg-red-700'
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
