import { usersService } from '@/services/users/users.service';

export const getUserByKindeIdController = async (kindeId: string) => {
	try {
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
