import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

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

		const body = await request.json();

		const { name, email, country, city, industry, description, website, phone, logo, banner, owner_id, members } =
			body;

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
					phone: phone || '',
					logo: logo || '',
					banner: banner || '',
					address: '', // You might want to add this field
					state: '', // You might want to add this field
					zip: '', // You might want to add this field
					owner_id: owner_id,
					members: members,
				})
				.returning();

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
					phone: phone || '',
					logo: logo || '',
					banner: banner || '',
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
