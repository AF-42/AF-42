import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const addressTable = sqliteTable('address', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    company_id       : text('company_id', { length : 255 }).notNull(),
    street_address_1 : text('street_address_1', { length : 255 }).notNull(),
    street_address_2 : text('street_address_2', { length : 255 }).notNull(),
    city_id          : text('city_id', { length : 255 }).notNull(),
    state_id         : text('state_id', { length : 255 }).notNull(),
    zip_code         : text('zip_code', { length : 255 }).notNull(),
    country          : text('country', { length : 255 }).notNull(),
    created_at       : integer('created_at', { mode : 'timestamp' })
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
