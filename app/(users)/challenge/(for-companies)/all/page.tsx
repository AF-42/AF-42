import { challengeService } from '@/backend/services/challenge.service';
import { AllChallengeCardComponent } from '@/components/challenge';

export default async function AllChallengesPage() {
    const challenges = await challengeService.getAllChallenges();
    return (
        <div>
            {challenges.map((challenge) => {
                return (
                    <AllChallengeCardComponent
                        key={challenge.id}
                        {...challenge}
                    />
                );
            })}
        </div>
    );
}
