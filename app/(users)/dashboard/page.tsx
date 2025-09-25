import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { PortalLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();

	if (!(await isAuthenticated())) {
	redirect('/home');
	}

	return (
	<>
			<div>Welcome to the Dashboard user: {user?.username}</div>

		<PortalLink>
				<Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm">
					Portal Link Name Dashboard
				</Button>
			</PortalLink>
		</>
	);
}
