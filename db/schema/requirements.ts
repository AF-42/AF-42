import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const requirementItemsTable = sqliteTable('requirement_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	challenge_id: text('challenge_id', { length: 255 }).notNull(),
	description: text('description', { length: 255 }).notNull(),
	fulfilled: integer('fulfilled', { mode: 'boolean' }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
