import { challengeService } from '@/backend/services/challenge.service';

export default async function ChallengePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const challenge = await challengeService.getChallengeById(id);
    if (!challenge) {
        throw new Error('Challenge not found');
    }

    return <div>ChallengePage {challenge[0].challenge_name}</div>;
}
