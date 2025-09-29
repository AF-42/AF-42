import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const companiesTable = sqliteTable('companies', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name', { length: 255 }).notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	phone: text('phone', { length: 255 }).notNull(),
	address: text('address', { length: 255 }).notNull(),
	city: text('city', { length: 255 }).notNull(),
	state: text('state', { length: 255 }).notNull(),
	zip: text('zip', { length: 255 }).notNull(),
	country: text('country', { length: 255 }).notNull(),
	website: text('website', { length: 255 }).notNull(),
	industry: text('industry', { length: 255 }).notNull(),
	description: text('description', { length: 255 }).notNull(),
	logo: text('logo', { length: 255 }).notNull(),
	banner: text('banner', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
