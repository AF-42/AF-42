import * as service from '@/backend/services';

export const updateUserCompanyId = async (userId: string, companyId: string) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!companyId) {
            throw new Error('Company ID is required');
        }
        const user = await service.users.updateCompanyId(userId, companyId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        console.error('[updateUserCompanyId] error:', error);
        throw new Error('Failed to update user company ID');
    }
};
