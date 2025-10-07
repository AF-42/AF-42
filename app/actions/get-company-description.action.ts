'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserByKindeIdController } from '@/backend/controllers/users/getUserByKindeId.controller';
import { getCompanyByUserIdController } from '@/backend/controllers/companies/getCompanyByUserId.controller';
import * as print from '@/lib/print-helpers';

export const getCompanyDescriptionAction = async () => {
	try {
		const { getUser, isAuthenticated } = getKindeServerSession();
		if (!(await isAuthenticated())) {
			throw new Error('User not authenticated');
		}

		const sessionUser = await getUser();
		if (!sessionUser?.id) {
			throw new Error('User not found');
		}

		const user = await getUserByKindeIdController(sessionUser?.id || '');
		if (!user || user.length === 0) {
			throw new Error('User not found');
		}

		const companyResult = await getCompanyByUserIdController(user[0].id);
		if (!companyResult || companyResult.length === 0) {
			throw new Error('No company found for the current user');
		}

		const companyDescription = companyResult[0].company.description;
		if (!companyDescription) {
			throw new Error('No company description found for the current user');
		}

		return [companyDescription]; // Return as array to match expected type
	} catch (error: any) {
		print.error('[getCompanyDescriptionAction] error: ', error);
		throw new Error(`Failed to get company description: ${error.message}`);
	}
};
