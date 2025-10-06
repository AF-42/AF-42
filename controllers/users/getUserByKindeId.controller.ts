import { usersService } from '@/backend/services/users.service';

export const getUserByKindeIdController = async (kindeId: string) => {
	try {
		if (!kindeId) {
			throw new Error('Kinde id is required');
		}
		const user = await usersService.getUserByKindeId(kindeId);

		if (!user) {
			throw new Error('User not found');
		}
		return user;
	} catch (error) {
		console.error('[getUserByKindeIdController] error: ', error);
		throw new Error('Failed to get user by kinde id');
	}
};
