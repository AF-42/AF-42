import { NextResponse, NextRequest } from 'next/server';
import { challengeService } from '@/backend/services/challenge.service';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: 'Challenge ID is required' },
                { status: 400 },
            );
        }

        await challengeService.deleteChallenge(id);

        return NextResponse.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        return NextResponse.json(
            { error: 'Failed to delete challenge' },
            { status: 500 },
        );
    }
}
