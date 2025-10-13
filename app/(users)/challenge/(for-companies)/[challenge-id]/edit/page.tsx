import { getChallengeDraftAction } from '@/app/actions/get-challenge-draft.action';
import { ChallengeDraftEditor } from '@/components/challenge';
import * as print from '@/lib/print-helpers';

export default async function EditChallengePage({
    params,
}: {
    params: Promise<{ 'company-id': string; 'challenge-id': string }>;
}) {
    const resolvedParameters = await params;
    const challengeId = resolvedParameters['challenge-id'];

    if (!challengeId) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>
                <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                    <div className='max-w-2xl mx-auto text-center'>
                        <div className='bg-red-50 border border-red-200 rounded-xl p-8'>
                            <h1 className='text-2xl font-bold text-red-600 mb-4'>
                                Invalid Challenge ID
                            </h1>
                            <p className='text-gray-600'>
                                No challenge ID was provided in the URL.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const challengeDraft = await getChallengeDraftAction(challengeId);
    print.log('[EditChallengePage] Challenge draft result:', challengeDraft);

    if (!challengeDraft || challengeDraft.length === 0) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>
                <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                    <div className='max-w-2xl mx-auto text-center'>
                        <div className='bg-red-50 border border-red-200 rounded-xl p-8'>
                            <h1 className='text-2xl font-bold text-red-600 mb-4'>
                                Challenge Not Found
                            </h1>
                            <p className='text-gray-600'>
                                The challenge you're looking for doesn't exist
                                or you don't have permission to access it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>

            {/* Main content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <ChallengeDraftEditor challengeDraft={challengeDraft[0]} />
            </div>
        </div>
    );
}
