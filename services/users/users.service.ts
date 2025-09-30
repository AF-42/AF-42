import { db } from '@/db';
import { usersTable } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const usersService = {
	createUser: async (user: typeof usersTable.$inferInsert) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.insert(usersTable).values(user);
	},
	getAllUsers: async () => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable);
	},
	getUserByKindeId: async (kindeId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.kinde_id, kindeId));
	},
	getUserByUsername: async (username: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.username, username));
	},
	getUserByEmail: async (email: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.email, email));
	},
	getUserById: async (id: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.id, id));
	},
	getUserByOrganizations: async (organizations: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.organizations, organizations));
	},
	getUserByPhone: async (phone: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.phone, phone));
	},
	getUserByIsPasswordResetRequested: async (isPasswordResetRequested: boolean) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database
			.select()
			.from(usersTable)
			.where(eq(usersTable.is_password_reset_requested, isPasswordResetRequested));
	},
	getUserByIsSuspended: async (isSuspended: boolean) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.is_suspended, isSuspended));
	},
	getUserByRole: async (role: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.role, role));
	},
	getUserByCreatedAt: async (createdAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.created_at, createdAt));
	},
	getUserByUpdatedAt: async (updatedAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(usersTable).where(eq(usersTable.updated_at, updatedAt));
	},
	updateUserRole: async (kindeId: string, role: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.update(usersTable).set({ role }).where(eq(usersTable.kinde_id, kindeId));
	},
	updateUserCompanyId: async (userId: string, companyId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.update(usersTable).set({ organizations: companyId }).where(eq(usersTable.id, userId));
	},
};
