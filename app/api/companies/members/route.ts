/**
 * API endpoint to retrieve all members of a company.
 * This route fetches the company members for the currently logged-in user by first
 * authenticating the user through Kinde, then looking up their user record, getting
 * their company, and finally retrieving all members of that company.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCompanyMembersController } from '@/backend/controllers/companies/getCompanyMembers.controller';
import { getUserByKindeIdController } from '@/backend/controllers/users/getUserByKindeId.controller';
import { companiesService } from '@/backend/services/companies.service';
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

		// Get all members of the company
		const members = await getCompanyMembersController(companyResult[0].id);

		return NextResponse.json({
			success: true,
			members: members,
			company: companyResult[0],
		});
	} catch (error) {
		console.error('Error fetching company members:', error);
		return NextResponse.json({ error: 'Failed to fetch company members' }, { status: 500 });
	}
}
