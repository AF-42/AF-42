import { ChallengeGeneratorSelectorComponent } from '@/components/challenge';

export default function GenerateChallengePage() {
    return (
        <div className='min-h-screen '>
            <div className='container mx-auto px-6 py-8'>
                <ChallengeGeneratorSelectorComponent />
            </div>
        </div>
    );
}
