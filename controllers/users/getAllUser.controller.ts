import { usersService } from '@/backend/services/users.service';

export const getAllUserController = async () => {
	try {
		const users = await usersService.getAllUsers();
		if (!users) {
			throw new Error('Users found in the database');
		}
		return users;
	} catch (error) {
		console.error('[getAllUserController] error: ', error);
		throw new Error('Failed to get all users');
	}
};
