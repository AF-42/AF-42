import { challengeService } from '@/services/challenge/challenge.service';

export default async function ChallengePage({ params }: { params: { id: string } }) {
	const { id } = params;
	const challenge = await challengeService.getChallengeById(id);
	if (!challenge) {
		throw new Error('Challenge not found');
	}

	return <div>ChallengePage {challenge[0].challenge_name}</div>;
}
