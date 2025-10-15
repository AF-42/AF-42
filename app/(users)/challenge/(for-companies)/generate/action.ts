'use server';

import { mastra } from '../../../../../mastra';
import * as print from '@/lib/print-helpers';

// Helper function to create a timeout promise
function createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
    });
}

// Server action to generate technical challenges using AI agent
export async function createTechChallenge(
    jobOffer: string,
    jsonConfig: string,
    issueDescription?: string,
    companyDescription?: string
) {
    try {
        // Get the AI agent named 'timmy' from Mastra
        const timmy = mastra.getAgent('timmy');

        if (!timmy) {
            throw new Error('Timmy agent not found');
        }

        // Parse the existing JSON config to add company description
        let configObject;
        try {
            configObject = JSON.parse(jsonConfig);
        }
        catch (error) {
            console.error('Failed to parse JSON config:', error);
            configObject = {};
        }

        // Add company description to the config if provided
        if (companyDescription) {
            configObject.company_description = companyDescription;
        }

        // Convert back to JSON string with company description included
        const enhancedJsonConfig = JSON.stringify(configObject, null, 2);

        // Generate challenge using AI with job offer, enhanced configuration, and issue description
        const prompt = `Create a technical challenge for ${jobOffer} with the following JSON config: ${enhancedJsonConfig}. Focus on addressing this specific issue: ${issueDescription} Focus on addressing this specific company description: ${companyDescription}`;

        print.log('Starting challenge generation with prompt length:', prompt.length);
        print.log('Prompt preview:', prompt.substring(0, 200) + '...');

        // Check if prompt is too long and truncate if necessary
        let finalPrompt = prompt;
        if (prompt.length > 50000) {
            print.log('Prompt is very long, truncating to prevent issues:', prompt.length);
            // Truncate the job offer part if it's too long
            const maxJobOfferLength = 20000;
            if (jobOffer.length > maxJobOfferLength) {
                const truncatedJobOffer = jobOffer.substring(0, maxJobOfferLength) + '... [truncated]';
                finalPrompt = `Create a technical challenge for ${truncatedJobOffer} with the following JSON config: ${enhancedJsonConfig}. Focus on addressing this specific issue: ${issueDescription} Focus on addressing this specific company description: ${companyDescription}`;
                print.log('Truncated prompt length:', finalPrompt.length);
            }
        }

        // Add timeout protection with retry logic to prevent hanging
        let challenge;
        let lastError;
        const maxRetries = 2;
        const timeoutMs = 30000; // 30 second timeout per attempt

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                print.log(`Challenge generation attempt ${attempt}/${maxRetries}`, '');

                challenge = await Promise.race([
                    timmy.generate(finalPrompt),
                    createTimeoutPromise(timeoutMs)
                ]);

                print.log(`Challenge generation attempt ${attempt} succeeded`, '');
                break; // Success, exit retry loop

            } catch (error) {
                lastError = error;
                print.error(`Challenge generation attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');

                if (attempt < maxRetries) {
                    const delayMs = attempt * 2000; // 2s, 4s delays
                    print.log(`Retrying in ${delayMs}ms...`, '');
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }

        if (!challenge) {
            // If all attempts failed, provide a helpful error message
            const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown error';
            if (errorMessage.includes('timed out')) {
                throw new Error('Challenge generation is taking too long. This might be due to a large job description or network issues. Please try with a shorter job description or check your internet connection.');
            }
            throw new Error(`Challenge generation failed after ${maxRetries} attempts: ${errorMessage}`);
        }

        print.log('Challenge generation completed, response length:', challenge?.text?.length || 0);

        // Validate the response
        if (!challenge || !challenge.text) {
            throw new Error('Agent returned empty or invalid response');
        }

        // Return the generated challenge text
        return challenge.text;
    } catch (error) {
        console.error('Error in createTechChallenge:', error);

        // Return a more descriptive error message
        if (error instanceof Error) {
            if (error.message.includes('timed out')) {
                throw new Error('Challenge generation timed out. Please try again with a shorter prompt or check your internet connection.');
            }
            throw new Error(`Challenge generation failed: ${error.message}`);
        }

        throw new Error('An unexpected error occurred during challenge generation');
    }
}
