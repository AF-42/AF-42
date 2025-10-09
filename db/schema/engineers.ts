import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const engineersTable = sqliteTable('engineers', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    user_id      : text('user_id', { length : 255 }).notNull(),
    address_id   : text('address_id', { length : 255 }).notNull(),
    email        : text('email', { length : 255 }).notNull(),
    website_url  : text('website_url', { length : 255 }).notNull(),
    github_url   : text('github_url', { length : 255 }).notNull(),
    linkedin_url : text('linkedin_url', { length : 255 }).notNull(),
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
