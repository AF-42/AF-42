import { db as database } from '@/db';
import { usersTable } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const usersModel = {
	create(user: typeof usersTable.$inferInsert) {
		return database.insert(usersTable).values(user);
	},
	update(userId: string, userData: Partial<typeof usersTable.$inferInsert>) {
		return database
			.update(usersTable)
			.set({ ...userData, updated_at: new Date() })
			.where(eq(usersTable.id, userId));
	},
	getAll() {
		return database.select().from(usersTable);
	},
	updateRole(kindeId: string, role: string) {
		return database.update(usersTable).set({ role }).where(eq(usersTable.kinde_id, kindeId));
	},
	updateCompanyId(userId: string, companyId: string) {
		return database.update(usersTable).set({ organizations: companyId }).where(eq(usersTable.id, userId));
	},
	getByKindeId(kindeId: string) {
		return database.select().from(usersTable).where(eq(usersTable.kinde_id, kindeId));
	},
	getByUsername(username: string) {
		return database.select().from(usersTable).where(eq(usersTable.username, username));
	},
	getByEmail(email: string) {
		return database.select().from(usersTable).where(eq(usersTable.email, email));
	},
	getById(id: string) {
		return database.select().from(usersTable).where(eq(usersTable.id, id));
	},
	getByOrganizations(organizations: string) {
		return database.select().from(usersTable).where(eq(usersTable.organizations, organizations));
	},
	getByIsPasswordResetRequested(isPasswordResetRequested: boolean) {
		return database
			.select()
			.from(usersTable)
			.where(eq(usersTable.is_password_reset_requested, isPasswordResetRequested));
	},
	getByRole(role: string) {
		return database.select().from(usersTable).where(eq(usersTable.role, role));
	},
};
