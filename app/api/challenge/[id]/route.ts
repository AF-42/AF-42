import { type NextRequest, NextResponse } from 'next/server';
import { challengeService } from '@/backend/services/challenge.service';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 });
        }

        await challengeService.deleteChallenge(id);

        return NextResponse.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 });
    }
}
