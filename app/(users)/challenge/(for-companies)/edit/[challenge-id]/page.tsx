import { challengeService } from '@/services/challenge/challenge.service';
import { ChallengeDraftEditor } from '@/components/challenge-draft-editor.component';
import * as print from '@/lib/print-helpers';

export default async function EditChallengePage({ params }: { params: Promise<{ 'challenge-id': string }> }) {
	const resolvedParams = await params;
	const challengeId = resolvedParams['challenge-id'];
	print.log('[EditChallengePage] Full params object:', resolvedParams);
	print.log('[EditChallengePage] challengeId: ', challengeId);
	print.log('[EditChallengePage] challengeId type:', typeof challengeId);

	if (!challengeId) {
		return (
			<div className="p-8 text-center">
				<h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Challenge ID</h1>
				<p className="text-gray-600">No challenge ID was provided in the URL.</p>
			</div>
		);
	}

	const challengeDraft = await challengeService.getChallengeByChallengeId(challengeId);
	print.log('[EditChallengePage] Challenge query result:', challengeDraft);

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

	return <ChallengeDraftEditor challengeDraft={challengeDraft[0].challenge_description} />;
}
