import { usersTable } from '@/db/schema/users';
import { api } from '@/lib/api-client';

// Users model: this is used to interact with the users api endpoint in order to handle all fetching

export const getUserProfile = async () => {
	return api.get('users/profile').json();
};

export const updateUserProfile = async (user: typeof usersTable.$inferInsert) => {
	return api.put('users/profile', { json: user }).json();
};
