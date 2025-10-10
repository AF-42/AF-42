import { type NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { updateUserRole } from '@/backend/controllers/users/update-user-role.controller';

export async function POST(request: NextRequest) {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        // Check if user is authenticated
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error : 'Unauthorized' }, { status : 401 });
        }

        const user = await getUser();
        if (!user?.id) {
            return NextResponse.json({ error : 'User not found' }, { status : 404 });
        }

        // Parse the request body
        const { role } = await request.json();

        if (!role) {
            return NextResponse.json({ error : 'Role is required' }, { status : 400 });
        }

        // Update the user role
        const updatedUser = await updateUserRole(user.id, role);

        return NextResponse.json({
            success : true,
            user    : updatedUser
        });
    }
    catch (error) {
        console.error('[API] Error updating user role:', error);
        return NextResponse.json({ error : 'Failed to update user role' }, { status : 500 });
    }
}
