import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id'>>) {
	await db.update(usersTable).set(data).where(eq(usersTable.id, id));
}
