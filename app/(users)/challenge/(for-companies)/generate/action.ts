'use server';

import { mastra } from '../../../../../mastra';

// Server action to generate technical challenges using AI agent
export async function createTechChallenge(
	jobOffer: string,
	jsonConfig: string,
	issueDescription?: string,
	companyDescription?: string,
) {
	// Get the AI agent named 'timmy' from Mastra
	const timmy = mastra.getAgent('timmy');

	// Parse the existing JSON config to add company description
	let configObject;
	try {
		configObject = JSON.parse(jsonConfig);
	} catch (error) {
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

	const challenge = await timmy.generate(prompt);

	// Return the generated challenge text
	return challenge.text;
}
