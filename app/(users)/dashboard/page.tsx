import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();

	if (!(await isAuthenticated())) {
		redirect('/home');
	}

	return (
		<>
			<div className="text-2xl font-bold">Welcome to the Dashboard user: {user?.username}</div>
		</>
	);
}
