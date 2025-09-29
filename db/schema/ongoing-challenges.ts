import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ongoingChallengesTable = sqliteTable('ongoing_challenges', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	engineer_id: text('engineer_id', { length: 255 }).notNull(),
	challenge_id: text('challenge_id', { length: 255 }).notNull(),
	is_ongoing: integer('is_ongoing', { mode: 'boolean' }).notNull(),
	is_completed: integer('is_completed', { mode: 'boolean' }).notNull(), // if the challenge is completed by the engineer
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
