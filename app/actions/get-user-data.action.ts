import { api } from '@/lib/api-client';
import { type UserProfileType } from '@/types/user-profile.type';

export const getUserData = async () => {
    try {
        const response = (await api.get('users/profile').json());
        if (!response.success) {
            throw new Error('Failed to get user data');
        }
        return response;
    }
    catch (error) {
        console.error('[getUserData] error:', error);
        throw new Error('Failed to get user data');
    }
};
