'use server';

import { challengeService } from '@/backend/services/challenge.service';
import * as print from '@/lib/print-helpers';
import { revalidatePath } from 'next/cache';

export type UpdateChallengeDraftParams = {
    id: string;
    challenge_description?: string;
    challenge_problem_overview?: string;
    challenge_problem_statement?: string;
    challenge_name?: string;
    challenge_difficulty?: string;
};

export const updateChallengeDraftAction = async (
    params: UpdateChallengeDraftParams,
) => {
    try {
        if (!params.id) {
            throw new Error('Missing challenge id');
        }

        const updatePayload: Record<string, any> = {};
        if (params.challenge_description !== undefined) {
            updatePayload.challenge_description = params.challenge_description;
        }
        if (params.challenge_problem_overview !== undefined) {
            updatePayload.challenge_problem_overview = params.challenge_problem_overview;
        }
        if (params.challenge_problem_statement !== undefined) {
            updatePayload.challenge_problem_statement = params.challenge_problem_statement;
        }
        if (params.challenge_name !== undefined) {
            updatePayload.challenge_name = params.challenge_name;
        }
        if (params.challenge_difficulty !== undefined) {
            updatePayload.challenge_difficulty = params.challenge_difficulty;
        }

        // Always bump updated_at if present in schema
        updatePayload.updated_at = new Date();

        await challengeService.updateChallenge(params.id, updatePayload);
        // Revalidate challenge detail and edit routes so changes show immediately
        revalidatePath(`/challenge/${params.id}`);
        revalidatePath(`/challenge/${params.id}/edit`);
        return { success: true };
    } catch (error: any) {
        print.error('[updateChallengeDraftAction] error: ', error);
        throw new Error(`Failed to update challenge draft: ${error.message}`);
    }
};
