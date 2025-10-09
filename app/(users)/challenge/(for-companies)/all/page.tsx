import { challengeService } from '@/backend/services/challenge.service';
import { AllChallengeCardComponent } from '@/components/challenge';

export default async function AllChallengesPage() {
	const challenges = await challengeService.getAllChallenges();
	return (
		<div>
			AllChallengesPage {challenges.length}
			{challenges.map((challenge) => (
				<AllChallengeCardComponent key={challenge.id} {...challenge} />
			))}
		</div>
	);
}
