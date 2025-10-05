import { issueTranslatorAgent } from '../agents/issue-translator-agent';

// Configuration for issue description translation
const CONFIG = {
	TIMEOUT_MS: 30000, // Base timeout (30 seconds)
	LONG_TEXT_TIMEOUT_MS: 120000, // Extended timeout for longer texts (2 minutes)
	CHUNK_SIZE: 3000, // Size of text chunks for very long texts
	CHUNK_OVERLAP: 200, // Overlap between chunks to maintain context
} as const;

/**
 * Splits text into chunks for processing long texts
 * @param text - The text to split
 * @param chunkSize - Maximum size of each chunk
 * @param overlap - Number of characters to overlap between chunks
 * @returns Array of text chunks
 */
function splitTextIntoChunks(
	text: string,
	chunkSize: number = CONFIG.CHUNK_SIZE,
	overlap: number = CONFIG.CHUNK_OVERLAP,
): string[] {
	if (text.length <= chunkSize) {
		return [text];
	}

	const chunks: string[] = [];
	let start = 0;

	while (start < text.length) {
		let end = start + chunkSize;

		// If this isn't the last chunk, try to break at a sentence boundary
		if (end < text.length) {
			const lastSentenceEnd = text.lastIndexOf('.', end);
			const lastNewline = text.lastIndexOf('\n', end);
			const breakPoint = Math.max(lastSentenceEnd, lastNewline);

			if (breakPoint > start + chunkSize * 0.5) {
				// Only break if we don't lose too much content
				end = breakPoint + 1;
			}
		}

		chunks.push(text.slice(start, end));
		start = end - overlap; // Start next chunk with overlap

		if (start >= text.length) break;
	}

	return chunks;
}

/**
 * Determines the appropriate timeout based on text length
 * @param textLength - Length of the text to translate
 * @returns Timeout duration in milliseconds
 */
function getTimeoutForText(textLength: number): number {
	// For texts longer than 2000 characters, use extended timeout
	if (textLength > 2000) {
		return CONFIG.LONG_TEXT_TIMEOUT_MS;
	}
	return CONFIG.TIMEOUT_MS;
}

/**
 * Creates a timeout promise for the translation request
 * @param timeoutMs - Timeout duration in milliseconds
 * @returns Promise that rejects after timeout
 */
function createTimeoutPromise(timeoutMs: number): Promise<never> {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Translation request timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});
}

/**
 * Translates a single chunk of text
 * @param chunk - The text chunk to translate
 * @param timeoutMs - Timeout for this chunk
 * @returns Promise resolving to translated chunk
 */
async function translateChunk(chunk: string, timeoutMs: number): Promise<string> {
	const response = await Promise.race([issueTranslatorAgent.generate(chunk), createTimeoutPromise(timeoutMs)]);

	if (!response || !response.text || typeof response.text !== 'string') {
		throw new Error('Invalid response format from translator agent');
	}

	const translatedText = response.text.trim();
	if (translatedText === '') {
		throw new Error('Translation resulted in empty text');
	}

	return translatedText;
}

export async function translateIssueDescriptionToEnglish(issueDescription: string) {
	try {
		const cleanedText = issueDescription.trim();
		const textLength = cleanedText.length;

		console.log(`Starting issue description translation for text of length: ${textLength}`);

		// Determine if we need to chunk the text
		const needsChunking = textLength > CONFIG.CHUNK_SIZE;
		const timeoutMs = getTimeoutForText(textLength);

		let translatedText: string;

		if (needsChunking) {
			console.log(`Issue description is long (${textLength} chars), using chunking approach`);

			// Split text into chunks
			const chunks = splitTextIntoChunks(cleanedText);
			console.log(`Split issue description into ${chunks.length} chunks`);

			// Translate each chunk
			const translatedChunks: string[] = [];
			for (let i = 0; i < chunks.length; i++) {
				const chunk = chunks[i];
				console.log(`Translating issue description chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);

				try {
					const translatedChunk = await translateChunk(chunk, timeoutMs);
					translatedChunks.push(translatedChunk);
				} catch (error) {
					console.error(`Failed to translate issue description chunk ${i + 1}:`, error);
					throw new Error(
						`Failed to translate issue description chunk ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
					);
				}
			}

			// Combine translated chunks
			translatedText = translatedChunks.join('\n\n');
			console.log(`Successfully translated ${chunks.length} issue description chunks`);
		} else {
			console.log(`Issue description is short (${textLength} chars), using single translation`);

			// Single translation for shorter texts
			const response = await Promise.race([
				issueTranslatorAgent.generate(cleanedText),
				createTimeoutPromise(timeoutMs),
			]);

			if (!response || !response.text) {
				throw new Error('Failed to translate issue description');
			}

			translatedText = response.text.trim();
		}

		console.log(`Issue description translation completed successfully`);
		return translatedText;
	} catch (error) {
		console.error('Error translating issue description:', error);
		throw new Error('Failed to translate issue description');
	}
}
