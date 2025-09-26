import { usersService } from '@/services/users/users.service';

export const getAllUserController = async () => {
    try {
	const users = await usersService.getAllUsers();
	if (!users) {
		throw new Error('Users not found');
		}
		return users;
	} catch (error) {
		console.error('[getAllUserController] error: ', error);
		throw new Error('Failed to get all users');
	}
};
