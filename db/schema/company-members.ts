import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const companyMembersTable = sqliteTable('company_members', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	company_id: text('company_id', { length: 255 }).notNull(),
	user_id: text('user_id', { length: 255 }).notNull(),
	is_admin: integer('is_admin', { mode: 'boolean' }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
