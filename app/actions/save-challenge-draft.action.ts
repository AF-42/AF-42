'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserByKindeIdController } from '@/backend/controllers/users/getUserByKindeId.controller';
import { getCompanyByUserIdController } from '@/backend/controllers/companies/getCompanyByUserId.controller';
import { challengeService } from '@/backend/services/challenge.service';
import * as print from '@/lib/print-helpers';

export interface SaveChallengeDraftParams {
	challengeDraft: string;
	extractedTechStack?: any;
	issueDescription: string;
	github_url: string;
}

export const saveChallengeDraftAction = async (params: SaveChallengeDraftParams) => {
	try {
		// Check if user is authenticated
		const { getUser, isAuthenticated } = getKindeServerSession();
		if (!(await isAuthenticated())) {
			throw new Error('User not authenticated');
		}

		// Get user data
		const sessionUser = await getUser();
		if (!sessionUser?.id) {
			throw new Error('User not found');
		}

		// Get user data
		const user = await getUserByKindeIdController(sessionUser?.id || '');
		if (!user || user.length === 0) {
			throw new Error('User not found');
		}

		// Get company data
		const companyResult = await getCompanyByUserIdController(user[0].id);
		if (!companyResult || companyResult.length === 0) {
			throw new Error('No company found for the current user');
		}

		const company = companyResult[0];

		// Generate a single unique ID to use for both DB and response
		const challengeId = crypto.randomUUID();

		// Create challenge object using the same ID
		const challengeData = {
			id: challengeId,
			company_id: company.id,
			engineer_id: user[0].id,
			github_url: params.github_url || '',
			is_published: false,
			challenge_industry: company.industry || 'Technology',
			challenge_name: `Challenge - ${new Date().toLocaleDateString()}`,
			challenge_description: params.challengeDraft,
			challenge_difficulty: params.extractedTechStack?.difficulty || 'mid',
			challenge_type: 'technical',
			challenge_status: 'draft',
			challenge_requirements:
				params.extractedTechStack?.technical_stack?.map((tech: string, index: number) => ({
					id: crypto.randomUUID(),
					name: tech,
					description: `Requirement for ${tech}`,
				})) || [],
			challenge_candidates_list: [],
		};

		// Save to database
		const result = await challengeService.createChallenge(challengeData);
		if (!result) {
			throw new Error('Failed to save challenge draft');
		} else {
			print.log('Challenge draft saved successfully:', challengeId);
		}

		return {
			success: true,
			challengeId,
			challengeData,
		};
	} catch (error: any) {
		print.error('[saveChallengeDraftAction] error: ', error);
		throw new Error(`Failed to save challenge draft: ${error.message}`);
	}
};
