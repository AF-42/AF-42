import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRoleSelector } from './user-role-selector';
import { getUserByKindeIdController } from '@/controllers/users/getUserByKindeId.controller';

export default async function Onboarding() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();
	const serviceUser = await getUserByKindeIdController(user?.id || '');

	// todo: redirect to proper page if user is not authenticated
	if (!(await isAuthenticated())) {
		redirect('/home');
	}

	// todo: Check if user has completed onboarding (you can add this logic based on your user model)
	const isNewUser =
		!serviceUser[0]?.created_at || new Date(serviceUser[0].created_at) > new Date(Date.now() - 5 * 60 * 1000); // Created within last 5 minutes

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-gray-900">
								Hello,{' '}
								<span className="font-semibold">
									{serviceUser[0]?.first_name || serviceUser[0]?.username}
								</span>
								!
							</CardTitle>
							<CardDescription className="text-gray-600">
								Please select your role to continue.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<UserRoleSelector isNewUser={isNewUser} />
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
