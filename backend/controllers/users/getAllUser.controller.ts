import * as service from '@/backend/services';

export const getAllUserController = async () => {
    try {
        const users = await service.users.getAll();
        if (!users) {
            throw new Error('No users found');
        }
        return users;
    }
    catch (error) {
        console.error('[getAllUserController] error:', error);
        throw new Error('Failed to get all users');
    }
};
