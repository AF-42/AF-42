import { challengeService } from '@/services/challenge/challenge.service';
import { ChallengeDraftEditor } from '@/components/challenge-draft-editor.component';

export default async function EditChallengePage({ params }: { params: { challengeId: string } }) {
	const { challengeId } = params;
	const challengeDraft = await challengeService.getChallengeByChallengeId(challengeId);

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
