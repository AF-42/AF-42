'use server';

import { companiesService } from '@/backend/services/companies.service';
import * as print from '@/lib/print-helpers';

export const getCompanyInfoAction = async (companyId: string) => {
    try {
        print.message(`[getCompanyInfoAction] Fetching company with ID: ${companyId}`);
        const company = await companiesService.getCompanyById(companyId);
        print.log(`[getCompanyInfoAction] Company result:`, company);

        if (!company || company.length === 0) {
            print.error(`[getCompanyInfoAction] No company found for ID: ${companyId}`, null);
            throw new Error('company not found');
        }
        return company;
    }
    catch (error: any) {
        print.error('[getCompanyInfoAction] error: ', error);
        throw new Error(`Failed to get company info: ${error.message}`);
    }
};
