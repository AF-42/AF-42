import { challengeService } from '@/backend/services/challenge.service';

export default async function ChallengePage({
    params,
}: {
    params: Promise<{ 'challenge-id': string }>;
}) {
    const resolvedParams = await params;
    const challenge = await challengeService.getChallengeById(
        resolvedParams['challenge-id'],
    );
    return <div>ChallengePage {challenge[0].challenge_name}</div>;
}
