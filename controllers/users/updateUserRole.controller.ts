import { usersService } from '@/services/users/users.service';

export const updateUserRole = async (kindeId: string, role: string) => {
	try {
		if (!kindeId) {
			throw new Error('Kinde id is required');
		}
		if (!role) {
			throw new Error('Role is required');
		}
		const user = await usersService.updateUserRole(kindeId, role);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	} catch (error) {
		console.error('[updateUserRoleController] error: ', error);
		throw new Error('Failed to update user role');
	}
};
