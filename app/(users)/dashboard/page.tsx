import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function DashboardPage() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	return <div>Welcome to the Dashboard user: {user?.username}</div>;
}
