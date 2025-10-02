import { challengesTable } from '@/db/schema/challenges';
import ky from 'ky';

const apiUrl = process.env.KINDE_SITE_URL;

export const addChallengeToDb = async (challenge: typeof challengesTable.$inferInsert) => {
	const response = await ky.post(`${apiUrl}/api/challenge`, {
		json: challenge,
	});
	return response.json();
};
