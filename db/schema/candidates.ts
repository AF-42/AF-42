import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const candidatesTable = sqliteTable('candidates', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    challenge_id            : text('challenge_id', { length : 255 }).notNull(),
    user_id                 : text('user_id', { length : 255 }).notNull(),
    candidate_name          : text('candidate_name', { length : 255 }).notNull(),
    candidate_email         : text('candidate_email', { length : 255 }).notNull(),
    candidate_score         : integer('candidate_score', { mode : 'number' }).notNull(),
    candidate_evaluation_id : text('candidate_evaluation_id', { length : 255 }).notNull(),
    created_at              : integer('created_at', { mode : 'timestamp' })
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
