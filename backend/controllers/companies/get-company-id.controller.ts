import { companiesService } from '@/backend/services/companies.service';

export const getCompanyIdController = async (kindeId: string) => {
    if (!kindeId) {
        throw new Error('Kinde id is required');
    }
    const company = await companiesService.getCompanyByEmail(kindeId);
    if (!company) {
        throw new Error('Company not found');
    }
    return company[0].id;
};
