import { ChallengeGeneratorSelectorComponent } from '@/components/challenge';

export default function GenerateChallengePage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>

            {/* Main content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <ChallengeGeneratorSelectorComponent />
            </div>
        </div>
    );
}

