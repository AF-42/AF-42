import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const companiesTable = sqliteTable('companies', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name', { length: 255 }).notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	phone: text('phone', { length: 255 }).notNull(),
	address: text('address', { length: 255 }).notNull(),
	city: text('city', { length: 255 }).notNull(),
	state: text('state', { length: 255 }).notNull(),
	zip: text('zip', { length: 255 }).notNull(),
	country: text('country', { length: 255 }).notNull(),
	website: text('website', { length: 255 }).notNull(),
	industry: text('industry', { length: 255 }).notNull(),
	description: text('description', { length: 255 }).notNull(),
	logo: text('logo', { length: 255 }).notNull(),
	banner: text('banner', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

export const companyMembersTable = sqliteTable('company_members', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	company_id: text('company_id', { length: 255 }).notNull(),
	user_id: text('user_id', { length: 255 }).notNull(),
	is_admin: integer('is_admin', { mode: 'boolean' }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

export const companyChallengesTable = sqliteTable('company_challenges', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	company_id: text('company_id', { length: 255 }).notNull(),
	challenge_id: text('challenge_id', { length: 255 }).notNull(),
	challenge_name: text('challenge_name', { length: 255 }).notNull(),
	challenge_description: text('challenge_description', { length: 255 }).notNull(),
	challenge_difficulty: text('challenge_difficulty', { length: 255 }).notNull(),
	challenge_type: text('challenge_type', { length: 255 }).notNull(),
	challenge_status: text('challenge_status', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

// todo: add evaluation_comments as optional
export const challengeEvaluationsTable = sqliteTable('challenge_evaluations', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	challenge_id: text('challenge_id', { length: 255 }).notNull(),
	evaluation_id: text('evaluation_id', { length: 255 }).notNull(),
	evaluation_score: integer('evaluation_score', { mode: 'number' }).notNull(),
	evaluation_feedback: text('evaluation_feedback', { length: 255 }).notNull(),
	evaluation_status: text('evaluation_status', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

// todo: add candidate_phone, candidate_resume, candidate_status as optional
export const challengeCandidatesTable = sqliteTable('challenge_candidates', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	challenge_id: text('challenge_id', { length: 255 }).notNull(),
	user_id: text('user_id', { length: 255 }).notNull(),
	candidate_name: text('candidate_name', { length: 255 }).notNull(),
	candidate_email: text('candidate_email', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});
