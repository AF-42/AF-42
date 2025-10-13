import { challengeService } from '@/backend/services/challenge.service';
import { AllChallengeCardComponent } from '@/components/challenge';

export default async function AllChallengesPage() {
    const challenges = await challengeService.getAllChallenges();

    return (
        <div className='min-h-screen bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>

            {/* Main content */}
            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
                <div className='w-full max-w-6xl mx-auto space-y-6 sm:space-y-8'>
                    {/* Header Section */}
                    <div className='text-center space-y-4 sm:space-y-6'>
                        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 font-source-code-pro'>
                            All Challenges
                        </h1>
                        <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0'>
                            Manage and review all your technical challenges
                        </p>
                    </div>

                    {/* Challenges Grid */}
                    <div className='space-y-4 sm:space-y-6'>
                        {challenges.length > 0 ? (
                            challenges.map((challenge) => (
                                <AllChallengeCardComponent
                                    key={challenge.id}
                                    {...challenge}
                                />
                            ))
                        ) : (
                            <div className='text-center py-12'>
                                <div className='bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto'>
                                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                                        No Challenges Yet
                                    </h3>
                                    <p className='text-gray-600 mb-4'>
                                        Create your first technical challenge to
                                        get started.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
