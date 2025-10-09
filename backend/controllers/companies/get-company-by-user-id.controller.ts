import { companiesService } from '@/backend/services/companies.service';
import * as print from '@/lib/print-helpers';

export const getCompanyByUserIdController = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error('User id is required');
        }

        const company = await companiesService.getCompanyByUserId(userId);
        if (!company || company.length === 0) {
            throw new Error('Company not found for this user');
        }

        return company;
    }
    catch (error: any) {
        print.error('[getCompanyByUserIdController] error: ', error);
        throw new Error(`Failed to get company by user id: ${error.message}`);
    }
};
