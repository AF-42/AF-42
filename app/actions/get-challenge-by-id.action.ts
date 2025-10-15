'use server';

import { challengeService } from '@/backend/services/challenge.service';

export async function getChallengeByIdAction(challengeId: string) {
    try {
        const challenge = await challengeService.getChallengeById(challengeId);
        return { success: true, data: challenge };
    } catch (error) {
        console.error('Error fetching challenge:', error);
        return { success: false, error: 'Failed to fetch challenge' };
    }
}
