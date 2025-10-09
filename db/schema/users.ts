import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    kinde_id                    : text('kinde_id', { length : 255 }).notNull().unique(),
    first_name                  : text('first_name', { length : 255 }).notNull(),
    last_name                   : text('last_name', { length : 255 }).notNull(),
    username                    : text('username', { length : 255 }).notNull().unique(),
    email                       : text('email', { length : 255 }).notNull().unique(),
    organizations               : text('organizations'),
    is_password_reset_requested : integer('is_password_reset_requested', { mode : 'boolean' }).notNull(),
    is_suspended                : integer('is_suspended', { mode : 'boolean' }).notNull(),
    role                        : text('role').notNull().default(''),
    is_company_member           : integer('is_company_member', { mode : 'boolean' }).notNull(),
    user_since                  : integer('user_since', { mode : 'timestamp' }).notNull(),
    last_login                  : integer('last_login', { mode : 'timestamp' }).notNull(),
    created_at                  : integer('created_at', { mode : 'timestamp' })
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
