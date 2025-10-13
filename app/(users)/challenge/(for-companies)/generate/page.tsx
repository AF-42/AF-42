import { ChallengeGeneratorSelectorComponent } from '@/components/challenge';

export default function GenerateChallengePage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100'>
            <div className='container mx-auto px-6 py-8'>
                <ChallengeGeneratorSelectorComponent />
            </div>
        </div>
    );
}
