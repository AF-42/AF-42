import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const challengesTable = sqliteTable('challenges', {
    id : text('id')
        .primaryKey()
        .$defaultFn(() => {
            return crypto.randomUUID();
        }),
    company_id             : text('company_id', { length : 255 }).notNull(),
    engineer_id            : text('engineer_id', { length : 255 }).notNull(),
    is_published           : integer('is_published', { mode : 'boolean' }).notNull(),
    github_url             : text('github_url', { length : 255 }).notNull(),
    challenge_industry     : text('challenge_industry', { length : 255 }).notNull(),
    challenge_name         : text('challenge_name', { length : 255 }).notNull(),
    challenge_description  : text('challenge_description', { length : 255 }).notNull(),
    challenge_difficulty   : text('challenge_difficulty', { length : 255 }).notNull(),
    challenge_type         : text('challenge_type', { length : 255 }).notNull(),
    challenge_status       : text('challenge_status', { length : 255 }).notNull(),
    challenge_problem_overview : text('challenge_problem_overview', { length : 255 }).notNull(),
    challenge_problem_statement : text('challenge_problem_statement', { length : 255 }).notNull(),
    challenge_requirements : text('challenge_requirements', { mode : 'json' })
        .notNull()
        .$type<Array<{id : string;
        name : string;
        description : string; }>>()
        .default(sql`(json_array())`),
    challenge_candidates_list : text('challenge_candidates_list', { mode : 'json' })
        .notNull()
        .$type<Array<{id : string;
        name : string;
        email : string;
        score : number;
        evaluation_id : string; }>>()
        .default(sql`(json_array())`),
    created_at : integer('created_at', { mode : 'timestamp' })
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
