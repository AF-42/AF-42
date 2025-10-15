import { eq } from 'drizzle-orm';
import { db as database } from '@/db';
import { challengesTable } from '@/db/schema/challenges';

export const challengesModel = {
    create(challenge: typeof challengesTable.$inferInsert) {
        return database.insert(challengesTable).values(challenge);
    },
    getAll() {
        return database.select().from(challengesTable);
    },
    getById(id: string) {
        return database.select().from(challengesTable).where(eq(challengesTable.id, id));
    },
    getByEngineerId(engineer_id: string) {
        return database.select().from(challengesTable).where(eq(challengesTable.engineer_id, engineer_id));
    },
    getByCompanyId(company_id: string) {
        return database.select().from(challengesTable).where(eq(challengesTable.company_id, company_id));
    },
    update(id: string, update: Partial<typeof challengesTable.$inferInsert>) {
        return database
            .update(challengesTable)
            .set(update)
            .where(eq(challengesTable.id, id));
    },
    delete(id: string) {
        return database.delete(challengesTable).where(eq(challengesTable.id, id));
    }
};
