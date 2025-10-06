import { companiesService } from '@/backend/services/companies.service';

export const getCompanyByIDController = async (kindeId: string) => {
	if (!kindeId) {
		throw new Error('Kinde id is required');
	}
	const company = await companiesService.getCompanyById(kindeId);
	if (!company) {
		throw new Error('Company not found');
	}
	return company;
};
