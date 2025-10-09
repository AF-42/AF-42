import { getChallengeDraftAction } from '@/app/actions/get-challenge-draft.action';
import { ChallengeDraftEditor } from '@/components/challenge';
import * as print from '@/lib/print-helpers';

export default async function EditChallengePage({
    params
}: {
    params: Promise<{ 'company-id': string;
        'challenge-id' : string;}>;
}) {
    const resolvedParameters = await params;
    const challengeId = resolvedParameters['challenge-id'];

    if (!challengeId) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Challenge ID</h1>
                <p className="text-gray-600">No challenge ID was provided in the URL.</p>
            </div>
        );
    }

    const challengeDraft = await getChallengeDraftAction(challengeId);
    print.log('[EditChallengePage] Challenge draft result:', challengeDraft);

    if (!challengeDraft || challengeDraft.length === 0) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Challenge Not Found</h1>
                <p className="text-gray-600">
                    The challenge you're looking for doesn't exist or you don't have permission to access it.
                </p>
            </div>
        );
    }

    return <ChallengeDraftEditor challengeDraft={challengeDraft[0]} />;
}
