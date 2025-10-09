import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const evaluationsTable = sqliteTable('evaluations', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    challenge_id        : text('challenge_id', { length : 255 }).notNull(),
    candidate_id        : text('candidate_id', { length : 255 }).notNull(),
    evaluation_id       : text('evaluation_id', { length : 255 }).notNull(),
    evaluation_score    : integer('evaluation_score', { mode : 'number' }).notNull(),
    evaluation_feedback : text('evaluation_feedback', { length : 255 }).notNull(),
    evaluation_status   : text('evaluation_status', { length : 255 }).notNull(),
    created_at          : integer('created_at', { mode : 'timestamp' })
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
