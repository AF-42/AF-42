import { challengeService } from '@/backend/services/challenge.service';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function PublishedPage() {
	const { getUser, isAuthenticated } = await getKindeServerSession();
	if (!(await isAuthenticated())) {
		throw new Error('Unauthorized');
	}
	const user = await getUser();
	if (!user?.id) {
		throw new Error('Unauthorized');
	}
	const challenges = await challengeService.getAllChallenges();
	return (
		<div>
			Total published challenges: <span className="font-bold text-red-700">{challenges.length}</span>
		</div>
	);
}
