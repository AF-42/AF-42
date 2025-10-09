import * as model from '../models';
import { type usersTable } from '@/db/schema/users';

export const usersService = {
    async createUser(user: typeof usersTable.$inferInsert) {
        if (!user) {
            throw new Error('User not provided');
        }
        if (!user.id) {
            throw new Error('User ID not provided');
        }
        const data = {
            kinde_id                    : user.id,
            email                       : user.email,
            first_name                  : user.first_name,
            last_name                   : user.last_name,
            username                    : user.username,
            organizations               : user.organizations,
            is_password_reset_requested : user.is_password_reset_requested,
            is_suspended                : user.is_suspended,
            role                        : '',
            is_company_member           : false,
            user_since                  : new Date(),
            last_login                  : new Date(),
            created_at                  : new Date(),
            updated_at                  : new Date()
        };
        const newUser = await model.users.create(data);
        if (!newUser) {
            throw new Error('User not returned by model');
        }
        return newUser;
    },
    async update(userId: string, userData: Partial<typeof usersTable.$inferInsert>) {
        const user = await model.users.update(userId, userData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getAll() {
        const users = await model.users.getAll();
        if (!users) {
            return [];
        }
        return users;
    },
    async getByKindeId(kindeId: string) {
        const user = await model.users.getByKindeId(kindeId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByUsername(username: string) {
        const user = await model.users.getByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByEmail(email: string) {
        const user = await model.users.getByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getById(id: string) {
        const user = await model.users.getById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByOrganizations(organizations: string) {
        const user = await model.users.getByOrganizations(organizations);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async getByRole(role: string) {
        const user = await model.users.getByRole(role);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async updateRole(kindeId: string, role: string) {
        const user = await model.users.updateRole(kindeId, role);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },
    async updateCompanyId(userId: string, companyId: string) {
        const user = await model.users.updateCompanyId(userId, companyId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
};
