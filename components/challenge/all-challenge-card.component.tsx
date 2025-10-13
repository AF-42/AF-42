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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function AllChallengeCardComponent(challenge: ChallengeType) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

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
        <div className='mx-auto border-b border-gray-200 pb-4'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Challenge Name:{challenge.challenge_name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Challenge Industry:{challenge.challenge_industry}</p>
                    <p>Challenge Difficulty:{challenge.challenge_difficulty}</p>
                    <p>Challenge Type:{challenge.challenge_type}</p>
                    <p>Challenge Status:{challenge.challenge_status}</p>
                    <p>Is Published:{challenge.is_published.toString()}</p>
                    <p>Github URL:{challenge.github_url}</p>
                </CardContent>
                <CardFooter className='grid grid-cols-3 gap-4'>
                    <Link href={`/challenge/${challenge.id}`}>
                        <Button variant='outline'>View Challenge</Button>
                    </Link>
                    <Link href={`/challenge/${challenge.id}/edit`}>
                        <Button variant='outline'>Edit Challenge</Button>
                    </Link>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='text-red-600 hover:text-red-700'
                            >
                                Delete Challenge
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Challenge</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete "
                                    {challenge.challenge_name}"? This action
                                    cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant='outline'
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='destructive'
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    );
}
