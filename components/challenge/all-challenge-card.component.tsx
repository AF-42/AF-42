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
                color: 'border-0 shadow-sm rounded-full',
                label: 'Draft',
                style: {
                    color: '#d97706',
                    backgroundColor: '#fef3c7',
                },
            };
        case 'published':
            return {
                icon: CheckCircle2,
                color: 'border-0 shadow-sm rounded-full',
                label: 'Published',
                style: {
                    color: '#059669',
                    backgroundColor: '#d1fae5',
                },
            };
        case 'archived':
            return {
                icon: AlertCircle,
                color: 'border-0 shadow-sm rounded-full',
                label: 'Archived',
                style: {
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                },
            };
        default:
            return {
                icon: Clock,
                color: 'border-0 shadow-sm rounded-full',
                label: status || 'Unknown',
                style: {
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                },
            };
    }
};

const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
        case 'junior':
        case 'entry':
            return {
                color: 'border-0 shadow-sm rounded-full',
                label: difficulty,
                style: {
                    color: '#059669',
                    backgroundColor: '#d1fae5',
                },
            };
        case 'mid':
        case 'mid-level':
        case 'intermediate':
            return {
                color: 'border-0 shadow-sm rounded-full',
                label: difficulty,
                style: {
                    color: '#d97706',
                    backgroundColor: '#fef3c7',
                },
            };
        case 'senior':
        case 'senior-level':
        case 'expert':
            return {
                color: 'border-0 shadow-sm rounded-full',
                label: difficulty,
                style: {
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                },
            };
        default:
            return {
                color: 'border-0 shadow-sm rounded-full',
                label: difficulty || 'Not specified',
                style: {
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                },
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
        <Card
            className='group relative border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden rounded-2xl'
            style={{
                backgroundColor: 'white',
                borderColor: '#e5e7eb',
            }}
        >
            <CardHeader className='relative p-4 sm:p-6 pb-3 sm:pb-4'>
                {/* Background gradient overlay */}
                <div
                    className='absolute inset-0'
                    style={{
                        background: `linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0f9ff)`,
                    }}
                ></div>

                <div className='relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4'>
                    {/* Icon and status indicator */}
                    <div className='relative flex-shrink-0 self-center sm:self-start'>
                        <div
                            className='text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
                            style={{ backgroundColor: '#3b82f6' }}
                        >
                            <Code className='size-4 sm:size-5' />
                        </div>
                        <div
                            className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg flex items-center justify-center'
                            style={{ backgroundColor: '#10b981' }}
                        >
                            <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full'></div>
                        </div>
                    </div>

                    {/* Title and badges section */}
                    <div className='flex-1 min-w-0 space-y-2 sm:space-y-3 w-full'>
                        {/* Title section */}
                        <div className='text-center sm:text-left'>
                            <CardTitle
                                className='text-base sm:text-lg font-bold mb-1 group-hover:transition-colors duration-300 leading-tight break-words'
                                style={{ color: '#111827' }}
                            >
                                {challenge.challenge_name ||
                                    'Untitled Challenge'}
                            </CardTitle>
                            <p
                                className='text-xs font-medium'
                                style={{
                                    color: '#6b7280',
                                }}
                            >
                                Challenge ID: #{challenge.id}
                            </p>
                        </div>

                        {/* Badges section */}
                        <div className='flex flex-wrap justify-center sm:justify-start gap-2'>
                            <Badge
                                variant='outline'
                                className={`text-xs px-2.5 py-1 font-semibold ${statusConfig.color}`}
                                style={statusConfig.style}
                            >
                                <StatusIcon className='size-3 mr-1' />
                                {statusConfig.label}
                            </Badge>
                            <Badge
                                variant='outline'
                                className={`text-xs px-2.5 py-1 font-semibold ${difficultyConfig.color}`}
                                style={difficultyConfig.style}
                            >
                                <Award className='size-3 mr-1' />
                                {difficultyConfig.label}
                            </Badge>
                            {challenge.challenge_industry && (
                                <Badge
                                    variant='outline'
                                    className='text-xs px-2.5 py-1 font-semibold border-0 shadow-sm rounded-full'
                                    style={{
                                        color: '#3b82f6',
                                        backgroundColor: '#dbeafe',
                                    }}
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
                        <div
                            className='group/item rounded-lg p-3 hover:shadow-md transition-all duration-300'
                            style={{
                                backgroundColor: '#dbeafe',
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <div
                                    className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'
                                    style={{
                                        backgroundColor: '#3b82f6',
                                    }}
                                >
                                    <Calendar
                                        className='size-3.5'
                                        style={{
                                            color: 'white',
                                        }}
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p
                                        className='text-xs font-medium'
                                        style={{
                                            color: '#6b7280',
                                        }}
                                    >
                                        Type
                                    </p>
                                    <p
                                        className='text-sm font-semibold truncate'
                                        style={{ color: '#111827' }}
                                    >
                                        {challenge.challenge_type ||
                                            'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className='group/item rounded-lg p-3 hover:shadow-md transition-all duration-300'
                            style={{
                                backgroundColor: '#d1fae5',
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <div
                                    className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'
                                    style={{
                                        backgroundColor: '#10b981',
                                    }}
                                >
                                    <Globe
                                        className='size-3.5'
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p
                                        className='text-xs font-medium'
                                        style={{
                                            color: '#6b7280',
                                        }}
                                    >
                                        Status
                                    </p>
                                    <p
                                        className='text-sm font-semibold'
                                        style={{
                                            color: challenge.is_published
                                                ? '#059669'
                                                : '#6b7280',
                                        }}
                                    >
                                        {challenge.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {challenge.github_url && (
                            <div
                                className='group/item rounded-lg p-3 hover:shadow-md transition-all duration-300'
                                style={{
                                    backgroundColor: '#f3f4f6',
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <div
                                        className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'
                                        style={{
                                            backgroundColor: '#6b7280',
                                        }}
                                    >
                                        <Github
                                            className='size-3.5'
                                            style={{
                                                color: 'white',
                                            }}
                                        />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p
                                            className='text-xs font-medium'
                                            style={{
                                                color: '#6b7280',
                                            }}
                                        >
                                            Repository
                                        </p>
                                        <a
                                            href={challenge.github_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm font-semibold truncate block transition-colors duration-200'
                                            style={{
                                                color: '#3b82f6',
                                            }}
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
                        <div
                            className='group/item rounded-lg p-3 hover:shadow-md transition-all duration-300'
                            style={{
                                backgroundColor: '#fef3c7',
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <div
                                    className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'
                                    style={{
                                        backgroundColor: '#f59e0b',
                                    }}
                                >
                                    <CheckCircle2
                                        className='size-3.5'
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p
                                        className='text-xs font-medium'
                                        style={{
                                            color: '#6b7280',
                                        }}
                                    >
                                        Requirements
                                    </p>
                                    <p
                                        className='text-lg font-bold'
                                        style={{ color: '#111827' }}
                                    >
                                        {challenge.challenge_requirements
                                            ?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className='group/item rounded-lg p-3 hover:shadow-md transition-all duration-300'
                            style={{
                                backgroundColor: '#f3f4f6',
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <div
                                    className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200'
                                    style={{
                                        backgroundColor: '#6b7280',
                                    }}
                                >
                                    <Clock
                                        className='size-3.5'
                                        style={{
                                            color: 'white',
                                        }}
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p
                                        className='text-xs font-medium'
                                        style={{
                                            color: '#6b7280',
                                        }}
                                    >
                                        Created
                                    </p>
                                    <p
                                        className='text-sm font-semibold'
                                        style={{ color: '#111827' }}
                                    >
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
            <CardFooter
                className='relative px-4 sm:px-6 py-3 sm:py-4'
                style={{
                    background: `linear-gradient(90deg, #f8fafc 0%, #ffffff 50%, #f0f9ff)`,
                }}
            >
                {/* Subtle border */}
                <div
                    className='absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px'
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%)`,
                    }}
                ></div>

                <div className='flex flex-col max-w-sm sm:flex-row gap-3 w-full'>
                    <Link
                        href={`/challenge/${challenge.id}`}
                        className='flex-1 group/btn'
                    >
                        <Button
                            variant='outline'
                            className='cursor-pointer w-full h-9 sm:h-10 justify-center sm:justify-start border-2 hover:shadow-lg transition-all duration-300 font-semibold group-hover/btn:scale-[1.02]'
                            style={{
                                borderColor: '#3b82f6',
                                backgroundColor: 'white',
                                color: '#3b82f6',
                            }}
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
                            className='cursor-pointer w-full h-9 sm:h-10 justify-center sm:justify-start border-2 hover:shadow-lg transition-all duration-300 font-semibold group-hover/btn:scale-[1.02]'
                            style={{
                                borderColor: '#10b981',
                                backgroundColor: 'white',
                                color: '#10b981',
                            }}
                        >
                            <Edit3 className='size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                            Edit Challenge
                        </Button>
                    </Link>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='cursor-pointer flex-1 sm:flex-none h-9 sm:h-10 justify-center sm:justify-start border-2 hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed group/btn'
                                disabled={isDeleting}
                                style={{
                                    borderColor: '#dc2626',
                                    backgroundColor: 'white',
                                    color: '#dc2626',
                                }}
                            >
                                <Trash2 className='size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className='sm:max-w-md border shadow-2xl rounded-2xl'
                            style={{
                                backgroundColor: 'white',
                                borderColor: '#e5e7eb',
                            }}
                        >
                            <DialogHeader className='pb-4'>
                                <DialogTitle
                                    className='flex items-center gap-3 text-xl font-bold'
                                    style={{ color: '#111827' }}
                                >
                                    <div
                                        className='w-12 h-12 rounded-xl flex items-center justify-center'
                                        style={{
                                            backgroundColor: '#dc2626',
                                        }}
                                    >
                                        <Trash2
                                            className='size-6'
                                            style={{
                                                color: 'white',
                                            }}
                                        />
                                    </div>
                                    Delete Challenge
                                </DialogTitle>
                                <DialogDescription
                                    className='pt-4 leading-relaxed text-base'
                                    style={{
                                        color: '#6b7280',
                                    }}
                                >
                                    Are you sure you want to delete "
                                    <span
                                        className='font-semibold'
                                        style={{ color: '#111827' }}
                                    >
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
                                    className='w-full sm:w-auto h-11 border-2 font-semibold'
                                    style={{
                                        borderColor: '#d1d5db',
                                        backgroundColor: 'white',
                                        color: '#6b7280',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className='w-full sm:w-auto h-11 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                                    style={{
                                        backgroundColor: '#dc2626',
                                    }}
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
