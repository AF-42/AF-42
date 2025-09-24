import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function DashboardPage() {
	const { getUser, getAccessToken, getIdToken } = getKindeServerSession();
	const user = await getUser();
	console.log('[user]', user);

	const accessToken = await getAccessToken();
	console.log('[accessToken]', accessToken);

	const idToken = await getIdToken();
	console.log('[idToken]', idToken);

	return <div>Welcome to the Dashboard user: {user?.username}</div>;
}
