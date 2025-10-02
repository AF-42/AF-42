import { companiesService } from '@/services/companies/companies.services';

export const getAllCompaniesController = async () => {
	try {
		const companies = await companiesService.getAllCompanies();
		if (!companies) {
			throw new Error('No companies found');
		}
		return companies;
	} catch (error) {
		console.error('[getAllCompaniesController] error: ', error);
		throw new Error('Failed to get all companies');
	}
};
