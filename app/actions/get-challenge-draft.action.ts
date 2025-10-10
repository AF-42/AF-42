'use server';

import { challengeService } from '@/backend/services/challenge.service';
import * as print from '@/lib/print-helpers';

export const getChallengeDraftAction = async (challengeId: string) => {
    try {
        const challenge = await challengeService.getChallengeById(challengeId);
        if (!challenge || challenge.length === 0) {
            throw new Error('challenge not found');
        }
        return challenge;
    }
    catch (error: any) {
        print.error('[getChallengeDraftAction] error: ', error);
        throw new Error(`Failed to get challenge draft: ${error.message}`);
    }
};
