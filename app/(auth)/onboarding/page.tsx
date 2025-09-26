import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingForm } from './onboarding-form';

export default async function Onboarding() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();
	console.log('[user] ', user);

	if (!(await isAuthenticated())) {
		redirect('/home');
	}

	// Check if user has completed onboarding (you can add this logic based on your user model)
	const isNewUser = !user?.created_at || new Date(user.created_at) > new Date(Date.now() - 5 * 60 * 1000); // Created within last 5 minutes

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold text-gray-900">Welcome to AFTER-42!</CardTitle>
						<CardDescription className="text-gray-600">
							{isNewUser ? 'Complete your profile setup' : 'Update your profile'}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="text-center">
							<p className="text-sm text-gray-500 mb-4">
								Hello, <span className="font-semibold">{user?.given_name || user?.username}</span>!
							</p>
							<p className="text-sm text-gray-600">
								{isNewUser
									? "Let's get you set up with your account."
									: 'You can update your profile information here.'}
							</p>
						</div>

						<div className="text-center text-sm text-gray-500 mb-4">
							<p>User ID: {user?.id}</p>
							<p>Email: {user?.email}</p>
						</div>

						<OnboardingForm isNewUser={isNewUser} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
