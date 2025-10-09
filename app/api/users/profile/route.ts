import { type NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserByKindeIdController } from '@/backend/controllers/users/get-user-by-kinde-id.controller';
import { usersService } from '@/backend/services/users.service';

/**
 * GET /api/users/profile - Retrieve the authenticated user's profile
 */
export async function GET(request: NextRequest) {
	try {
		const { getUser, isAuthenticated } = getKindeServerSession();

		// Check if user is authenticated
		if (!(await isAuthenticated())) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		const user = await getUser();
		if (!user?.id) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		// Get user by kinde ID
		const userResult = await getUserByKindeIdController(user.id);
		if (!userResult || userResult.length === 0) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}
		const userProfile = userResult[0];

		// Return user profile data
		return NextResponse.json({
			success: true,
			user: {
				id: userProfile.id,
				first_name: userProfile.first_name,
				last_name: userProfile.last_name,
				username: userProfile.username,
				email: userProfile.email,
				role: userProfile.role,
				organizations: userProfile.organizations,
				user_since: userProfile.user_since,
				last_login: userProfile.last_login,
				created_at: userProfile.created_at,
				updated_at: userProfile.updated_at,
			},
		});
	} catch (error) {
		console.error('[API] Error fetching user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user profile' },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/users/profile - Update the authenticated user's profile
 */
export async function PUT(request: NextRequest) {
	try {
		const { getUser, isAuthenticated } = getKindeServerSession();

		// Check if user is authenticated
		if (!(await isAuthenticated())) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		const user = await getUser();
		if (!user?.id) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		// Get user by kinde ID to get the internal user ID
		const userResult = await getUserByKindeIdController(user.id);
		if (!userResult || userResult.length === 0) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		const userId = userResult[0].id;

		// Parse the request body
		const body = await request.json();
		const { first_name, last_name, username, email, role } = body;

		// Validate required fields
		if (!first_name || !last_name || !username || !email || !role) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		// Prepare update data (only include fields that exist in the schema)
		const updateData: any = {
			first_name,
			last_name,
			username,
			email,
			role,
		};

		// Update the user profile
		const updatedUser = await usersService.update(userId, updateData);

		if (!updatedUser) {
			return NextResponse.json(
				{ error: 'Failed to update user profile' },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			user: {
				...updatedUser,
			},
		});
	} catch (error) {
		console.error('[API] Error updating user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to update user profile' },
			{ status: 500 },
		);
	}
}
