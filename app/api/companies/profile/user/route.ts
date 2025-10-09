/**
 * API endpoint to retrieve a company profile associated with the authenticated user.
 * This route fetches the company information for the currently logged-in user by first
 * authenticating the user through Kinde, then looking up their user record, and finally
 * retrieving the associated company profile. Returns the company data if found, or appropriate
 * error responses for authentication failures or missing records.
 */

import { NextRequest, NextResponse } from 'next/server';
import { companiesService } from '@/backend/services/companies.service';
import { getUserByKindeIdController } from '@/backend/controllers/users/getUserByKindeId.controller';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(request: NextRequest) {
	try {
		// Get the authenticated user from Kinde
		const { getUser, isAuthenticated } = getKindeServerSession();

		if (!(await isAuthenticated())) {
			return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
		}

		const user = await getUser();
		if (!user?.id) {
			return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
		}

		// Get user by kinde ID
		const userResult = await getUserByKindeIdController(user.id);
		if (!userResult || userResult.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Get company by user ID
		const companyResult = await companiesService.getCompanyByUserId(userResult[0].id);
		if (!companyResult || companyResult.length === 0) {
			return NextResponse.json(
				{
					error: 'Company not found for this user',
					hasCompany: false,
				},
				{ status: 404 },
			);
		}
		return NextResponse.json({
			success: true,
			company: companyResult[0],
			hasCompany: true,
		});
	} catch (error) {
		console.error('Error fetching company profile:', error);
		return NextResponse.json({ error: 'Failed to fetch company profile' }, { status: 500 });
	}
}
