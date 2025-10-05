'use server';

import { translateIssueDescriptionToEnglish } from '../../mastra/utils/translate-issue-description-to-english';

export async function translateIssueDescriptionAction(issueDescription: string): Promise<string> {
	try {
		const translatedText = await translateIssueDescriptionToEnglish(issueDescription);
		if (!translatedText) {
			throw new Error('Failed to translate issue description');
		}
		return translatedText;
	} catch (error) {
		console.error('Error translating issue description:', error);
		throw new Error('Failed to translate issue description');
	}
}
