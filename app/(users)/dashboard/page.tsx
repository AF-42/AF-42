import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const user = await getUser();

	if (!(await isAuthenticated())) {
		redirect('/home');
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-lg font-semibold">Welcome back!</h2>
						<p className="text-sm text-muted-foreground">Hello, {user?.username}</p>
					</div>
				</div>
				<div className="bg-muted/50 aspect-video rounded-xl" />
				<div className="bg-muted/50 aspect-video rounded-xl" />
			</div>
			<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
		</div>
	);
}
