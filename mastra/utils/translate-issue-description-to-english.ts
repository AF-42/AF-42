import { issueTranslatorAgent } from '../agents/issue-translator-agent';

export async function translateIssueDescriptionToEnglish(issueDescription: string) {
	const response = await issueTranslatorAgent.generate(issueDescription);
	return response.text;
}
