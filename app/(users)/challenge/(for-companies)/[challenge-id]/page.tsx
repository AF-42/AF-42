import { challengeService } from '@/backend/services/challenge.service';

export default async function ChallengePage({ params }: {params : {'challenge-id' : string}}) {
    const challenge = await challengeService.getChallengeById(params['challenge-id']);
    return <div>ChallengePage {challenge[0].challenge_name}</div>;
}
