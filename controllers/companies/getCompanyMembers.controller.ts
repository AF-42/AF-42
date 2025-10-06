import { companiesService } from '@/backend/services/companies.service';

export const getCompanyMembersController = async (companyId: string) => {
	try {
		const members = await companiesService.getCompanyMembers(companyId);
		if (!members) {
			throw new Error('No members found for this company');
		}
		return members;
	} catch (error) {
		console.error('[getCompanyMembersController] error: ', error);
		throw new Error('Failed to get company members');
	}
};
