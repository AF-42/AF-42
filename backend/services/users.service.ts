import * as models from '../models';
import { usersTable } from '@/db/schema/users';

const usersService = {
	createUser: async (user: typeof usersTable.$inferInsert) => {
		if (!user) {
			throw new Error('User not provided');
		}
		const data = {
			kinde_id: user.id,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			username: user.username,
			organizations: user.organizations,
			is_password_reset_requested: user.is_password_reset_requested,
			is_suspended: user.is_suspended,
			role: '',
			user_since: new Date(),
			last_login: new Date(),
			created_at: new Date(),
			updated_at: new Date(),
		};
		const newUser = await models.users.create(data);
		if (!newUser) {
			throw new Error('User not returned by model');
		}
		return newUser;
	},
	getAll: async () => {
		const users = await models.users.getAll();
		if (!users) {
			return [];
		}
		return users;
	},
	getUserByKindeId: async (kindeId: string) => {
		const user = await models.users.getByKindeId(kindeId);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	getUserByUsername: async (username: string) => {
		const user = await models.users.getByUsername(username);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	getUserByEmail: async (email: string) => {
		const user = await models.users.getByEmail(email);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	getUserById: async (id: string) => {
		const user = await models.users.getById(id);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	getUserByOrganizations: async (organizations: string) => {
		const user = await models.users.getByOrganizations(organizations);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	getUserByIsPasswordResetRequested: async (isPasswordResetRequested: boolean) => {
		const user = await models.users.getByIsPasswordResetRequested(isPasswordResetRequested);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	// getUserByIsSuspended: async (isSuspended: boolean) => {
	// 	const user = await models.users.getByIsSuspended(isSuspended);
	// 	if (!user) {
	// 		throw new Error('User not found');
	// 	}
	// 	return user;
	// },
	getUserByRole: async (role: string) => {
		const user = await models.users.getByRole(role);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	updateUserRole: async (kindeId: string, role: string) => {
		const user = await models.users.updateUserRole(kindeId, role);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	updateUserCompanyId: async (userId: string, companyId: string) => {
		const user = await models.users.updateUserCompanyId(userId, companyId);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
	updateUser: async (userId: string, userData: Partial<typeof usersTable.$inferInsert>) => {
		const user = await models.users.updateUser(userId, userData);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	},
};

export default usersService;
