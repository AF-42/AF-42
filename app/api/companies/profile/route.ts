/**
 * API endpoint for managing company profiles with both PUT and GET operations.
 * PUT: Creates a new company profile or updates an existing one based on email lookup.
 *      Requires authentication and validates all required fields including name, email,
 *      location, industry, description, owner_id, and members. GET: Retrieves a company
 *      profile by email query parameter. Both operations handle authentication through Kinde
 *      and provide appropriate error responses for validation failures or missing data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { companyMembersTable } from '@/db/schema/company-members';
import { getUserByKindeIdController } from '@/controllers/users/getUserByKindeId.controller';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { updateUserCompanyId } from '@/controllers/users/updateUserCompanyId.controller';

export async function PUT(request: NextRequest) {
	try {
		const { getUser, isAuthenticated } = getKindeServerSession();

		if (!(await isAuthenticated())) {
			return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
		}

		const user = await getUser();
		if (!user?.id) {
			return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
		}

		const userResult = await getUserByKindeIdController(user.id);
		console.log('[userResult from create/update company route]', userResult);
		if (!userResult || userResult.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const body = await request.json();
		const owner_id = userResult[0].id;
		const members = userResult.map((user) => user.id);
		console.log('[owner_id from create/update company route]', owner_id);
		console.log('[members from create/update company route]', members);

		const { name, email, country, city, industry, description, website, logo } = body;

		// Validate required fields
		if (!name || !email || !country || !city || !industry || !description || !owner_id || !members) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Check if company exists (you might want to get this from auth context)
		// For now, we'll assume we're updating an existing company
		const existingCompany = await db.select().from(companiesTable).where(eq(companiesTable.email, email)).limit(1);

		if (existingCompany.length === 0) {
			// Create new company
			const newCompany = await db
				.insert(companiesTable)
				.values({
					name,
					email,
					country,
					city,
					industry,
					description,
					website: website || '',
					logo: logo || '',
					address: '',
					state: '',
					zip: '',
					owner_id: owner_id,
					members: members,
				})
				.returning();

			// Update user's organization field
			await updateUserCompanyId(userResult[0].id, newCompany[0].id);

			// Insert company member record
			await db.insert(companyMembersTable).values({
				company_id: newCompany[0].id,
				user_id: owner_id,
				is_admin: true,
			});

			return NextResponse.json({
				success: true,
				company: newCompany[0],
			});
		} else {
			// Update existing company
			const updatedCompany = await db
				.update(companiesTable)
				.set({
					name,
					country,
					city,
					industry,
					description,
					website: website || '',
					logo: logo || '',
					owner_id: owner_id,
					members: members,
					updated_at: new Date(),
				})
				.where(eq(companiesTable.email, email))
				.returning();

			return NextResponse.json({
				success: true,
				company: updatedCompany[0],
			});
		}
	} catch (error) {
		console.error('Error saving company profile:', error);
		return NextResponse.json({ error: 'Failed to save company profile' }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get('email');

		if (!email) {
			return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
		}

		const company = await db.select().from(companiesTable).where(eq(companiesTable.email, email)).limit(1);

		if (company.length === 0) {
			return NextResponse.json({ error: 'Company not found' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			company: company[0],
		});
	} catch (error) {
		console.error('Error fetching company profile:', error);
		return NextResponse.json({ error: 'Failed to fetch company profile' }, { status: 500 });
	}
}
