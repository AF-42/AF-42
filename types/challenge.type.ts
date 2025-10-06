export type ChallengeType = {
	id: string;
	company_id: string;
	is_published: boolean;
	challenge_id: string;
	challenge_industry: string;
	challenge_name: string;
	challenge_description: string;
	challenge_difficulty: string;
	challenge_type: string;
	challenge_status: string;
	challenge_requirements: { id: string; name: string; description: string }[];
	challenge_candidates_list: { id: string; name: string; email: string; score: number; evaluation_id: string }[];
	created_at: Date;
	updated_at: Date;
};
