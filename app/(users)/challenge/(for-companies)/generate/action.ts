'use server';

import { mastra } from '../../../../../mastra';

// Server action to generate technical challenges using AI agent
export async function createTechChallenge(jobOffer: string, jsonConfig: string, issueDescription?: string) {
	// Get the AI agent named 'timmy' from Mastra
	const timmy = mastra.getAgent('timmy');

	// Generate challenge using AI with job offer, configuration, and issue description
	const prompt = issueDescription
		? `Create a technical challenge for ${jobOffer} with the following JSON config: ${jsonConfig}. Focus on addressing this specific issue: ${issueDescription}`
		: `Create a technical challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`;

	const challenge = await timmy.generate(prompt);

	// Return the generated challenge text
	return challenge.text;
}
