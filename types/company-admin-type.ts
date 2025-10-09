import { type UserProfileType } from './user-profile.type';

export type CompanyAdminType = {
	id: string;
	company_id: string;
	user_id: string;
	is_admin: boolean;
	created_at: Date;
	updated_at: Date;
	user: UserProfileType;
};
