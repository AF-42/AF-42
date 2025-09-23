import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function DashboardPage() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	return <div>Dashboard {user?.username}</div>;
}
