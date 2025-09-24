import { LoginLink, getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

// Todo: add management api js to get the roles and users ???
// import { Roles, Users } from '@kinde/management-api-js';

import { PortalLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();

	// todo: add a toast message or a popup message to let the user know that they are not authenticated and to login
	if (!(await isAuthenticated())) {
		redirect('/home');
	}

	return (await isAuthenticated()) ? (
		<>
			<div>Welcome to the Dashboard user: {user?.username}</div>

			<PortalLink>
				<Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm">
					Portal Link Name
				</Button>
			</PortalLink>
		</>
	) : (
		<div>
			This page is protected, please <LoginLink>Login</LoginLink> to view it
		</div>
	);
}
