import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const completedChallengesTable = sqliteTable('completed_challenges', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    engineer_id  : text('engineer_id', { length : 255 }).notNull(),
    challenge_id : text('challenge_id', { length : 255 }).notNull(),
    is_completed : integer('is_completed', { mode : 'boolean' }).notNull(), // If the challenge is completed by the engineer
    is_validated : integer('is_validated', { mode : 'boolean' }).notNull(), // If the challenge is validated by the ai
    is_ongoing   : integer('is_ongoing', { mode : 'boolean' }).notNull(), // If the challenge is ongoing
    completed_at : integer('completed_at', { mode : 'timestamp' })
        .notNull()
        .$defaultFn(() => {
            return new Date();
        }),
    updated_at : integer('updated_at', { mode : 'timestamp' })
        .notNull()
        .$defaultFn(() => {
            return new Date();
        })
        .$onUpdate(() => {
            return new Date();
        }),
    created_at : integer('created_at', { mode : 'timestamp' })
        .notNull()
        .$defaultFn(() => {
            return new Date();
        })
});
