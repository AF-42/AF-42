import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ongoingChallengesTable = sqliteTable('ongoing_challenges', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    engineer_id  : text('engineer_id', { length : 255 }).notNull(),
    challenge_id : text('challenge_id', { length : 255 }).notNull(),
    is_ongoing   : integer('is_ongoing', { mode : 'boolean' }).notNull(),
    is_completed : integer('is_completed', { mode : 'boolean' }).notNull(), // If the challenge is completed by the engineer
    created_at   : integer('created_at', { mode : 'timestamp' })
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
        })
});
