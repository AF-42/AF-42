'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChallengeNotFound() {
    return (
        <div className='flex flex-1 flex-col min-h-screen items-center justify-center'>
            <div className='text-center'>
                <h1 className='text-2xl font-bold text-slate-900 mb-4'>
                    Challenge Not Found
                </h1>
                <p className='text-slate-600 mb-6'>
                    The challenge you're looking for doesn't exist or has been
                    removed.
                </p>
                <Button variant='outline' onClick={() => window.history.back()}>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Go Back
                </Button>
            </div>
        </div>
    );
}
