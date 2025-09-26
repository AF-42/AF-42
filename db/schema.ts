import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	kinde_id: text('kinde_id', { length: 255 }).notNull().unique(),
	first_name: text('first_name', { length: 255 }).notNull(),
	last_name: text('last_name', { length: 255 }).notNull(),
	username: text('username', { length: 255 }).notNull().unique(),
	email: text('email', { length: 255 }).notNull().unique(),
	organizations: text('organizations'),
	phone: text('phone'),
	is_password_reset_requested: integer('is_password_reset_requested', { mode: 'boolean' }).notNull(),
	is_suspended: integer('is_suspended', { mode: 'boolean' }).notNull(),
	role: text('role').notNull().default(''),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
