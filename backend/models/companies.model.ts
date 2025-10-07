import { db as database } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { eq } from 'drizzle-orm';

export const companiesModel = {
	create(company: typeof companiesTable.$inferInsert) {
		return database.insert(companiesTable).values(company);
	},
	update(companyId: string, companyData: Partial<typeof companiesTable.$inferInsert>) {
		return database
			.update(companiesTable)
			.set({ ...companyData, updated_at: new Date() })
			.where(eq(companiesTable.id, companyId));
	},
	getAll() {
		return database.select().from(companiesTable);
	},
	getByEmail(email: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.email, email));
	},
	getById(id: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.id, id));
	},
	getByOwnerId(ownerId: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.owner_id, ownerId));
	},
	getByUserId(userId: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.owner_id, userId));
	},
    getMembers(companyId: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.id, companyId));
	},
	getByIndustry(industry: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.industry, industry));
	},
};
