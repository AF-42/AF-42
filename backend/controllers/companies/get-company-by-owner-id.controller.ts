import { companiesService } from '@/backend/services/companies.service';

export const getCompanyByOwnerIdController = async (ownerId: string) => {
    if (!ownerId) {
        throw new Error('Owner id is required');
    }
    const company = await companiesService.getCompanyByOwnerId(ownerId);
    if (!company || company.length === 0) {
        throw new Error('Company not found for this owner');
    }
    return company;
};
