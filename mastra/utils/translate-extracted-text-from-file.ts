/**
 * Translation Utility for File Extracted Text
 *
 * This module provides a robust translation service for text extracted from various file formats
 * (PDF, DOCX, TXT, etc.) using the Mastra translator agent. It includes comprehensive error handling,
 * input validation, retry logic with exponential backoff, and timeout protection to ensure reliable
 * translation operations. The service validates input text for length, content quality, and format,
 * handles network failures gracefully, and provides detailed metadata about translation operations.
 *
 * Key Features:
 * - Input validation (length limits, content quality checks)
 * - Retry mechanism with exponential backoff for transient failures
 * - Timeout protection (30 seconds default)
 * - Comprehensive error handling with user-friendly messages
 * - Performance monitoring and structured logging
 * - Type-safe interfaces for integration
 *
 * @author AF42 Development Team
 * @version 1.0.0
 */

// Translation service configuration
import { translatorAgent } from '../agents/translator-agent';

// Define interfaces for better type safety
interface TranslationResult {
	success: boolean;
	translatedText?: string;
	error?: string;
	metadata?: {
		originalLength: number;
		translatedLength: number;
		processingTimeMs: number;
	};
}

interface TranslationError extends Error {
	code?: string;
	statusCode?: number;
}

// Configuration constants
const CONFIG = {
	MAX_TEXT_LENGTH: 50000, // Maximum characters to prevent API limits
	MIN_TEXT_LENGTH: 1, // Minimum characters for meaningful translation
	TIMEOUT_MS: 30000, // Base timeout (30 seconds)
	LONG_TEXT_TIMEOUT_MS: 120000, // Extended timeout for longer texts (2 minutes)
	CHUNK_SIZE: 3000, // Size of text chunks for very long texts
	CHUNK_OVERLAP: 200, // Overlap between chunks to maintain context
	RETRY_ATTEMPTS: 3, // Number of retry attempts for failed requests
	RETRY_DELAY_MS: 1000, // Delay between retries in milliseconds
} as const;

/**
 * Validates input text for translation
 * @param text - The text to validate
 * @returns Validation result with error message if invalid
 */
function validateInput(text: string): { isValid: boolean; error?: string } {
	if (typeof text !== 'string') {
		return { isValid: false, error: 'Input must be a string' };
	}

	if (!text || text.trim() === '') {
		return { isValid: false, error: 'Input text cannot be empty' };
	}

	if (text.length < CONFIG.MIN_TEXT_LENGTH) {
		return { isValid: false, error: `Text must be at least ${CONFIG.MIN_TEXT_LENGTH} character long` };
	}

	if (text.length > CONFIG.MAX_TEXT_LENGTH) {
		return { isValid: false, error: `Text exceeds maximum length of ${CONFIG.MAX_TEXT_LENGTH} characters` };
	}

	// Check for potentially problematic content
	const suspiciousPatterns = [
		/^[\s\n\r\t]+$/, // Only whitespace
		/^[0-9\s\n\r\t.,;:!?\-_=+*&^%$#@()\[\]{}|\\/<>]+$/, // Only numbers and symbols
	];

	for (const pattern of suspiciousPatterns) {
		if (pattern.test(text)) {
			return { isValid: false, error: 'Text appears to contain only whitespace, numbers, or symbols' };
		}
	}

	return { isValid: true };
}

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
 * Retries a function with exponential backoff
 * @param fn - Function to retry
 * @param attempts - Number of retry attempts
 * @param delayMs - Initial delay between retries
 * @returns Promise resolving to function result
 */
async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	attempts: number = CONFIG.RETRY_ATTEMPTS,
	delayMs: number = CONFIG.RETRY_DELAY_MS,
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			// Don't retry on certain types of errors
			if (error instanceof Error) {
				const errorMessage = error.message.toLowerCase();
				if (
					errorMessage.includes('invalid') ||
					errorMessage.includes('unauthorized') ||
					errorMessage.includes('forbidden') ||
					errorMessage.includes('not found')
				) {
					throw error;
				}
			}

			if (attempt === attempts) {
				throw lastError;
			}

			// Exponential backoff
			const backoffDelay = delayMs * Math.pow(2, attempt - 1);
			console.warn(`Translation attempt ${attempt} failed, retrying in ${backoffDelay}ms:`, error);
			await new Promise((resolve) => setTimeout(resolve, backoffDelay));
		}
	}

	throw lastError!;
}

/**
 * Translates a single chunk of text
 * @param chunk - The text chunk to translate
 * @param timeoutMs - Timeout for this chunk
 * @returns Promise resolving to translated chunk
 */
async function translateChunk(chunk: string, timeoutMs: number): Promise<string> {
	const response = await Promise.race([
		retryWithBackoff(async () => {
			return await translatorAgent.generate(chunk);
		}),
		createTimeoutPromise(timeoutMs),
	]);

	if (!response || !response.text || typeof response.text !== 'string') {
		throw new Error('Invalid response format from translator agent');
	}

	const translatedText = response.text.trim();
	if (translatedText === '') {
		throw new Error('Translation resulted in empty text');
	}

	return translatedText;
}

/**
 * Translates extracted text from a file using the translator agent
 * @param extractedText - The text to translate
 * @returns Promise resolving to translation result
 */
export async function translateExtractedTextFromFile(extractedText: string): Promise<TranslationResult> {
	const startTime = Date.now();

	try {
		// Input validation
		const validation = validateInput(extractedText);
		if (!validation.isValid) {
			return {
				success: false,
				error: validation.error,
				metadata: {
					originalLength: extractedText?.length || 0,
					translatedLength: 0,
					processingTimeMs: Date.now() - startTime,
				},
			};
		}

		// Clean and prepare text
		const cleanedText = extractedText.trim();
		const textLength = cleanedText.length;

		console.log(`Starting translation for text of length: ${textLength}`);

		// Determine if we need to chunk the text
		const needsChunking = textLength > CONFIG.CHUNK_SIZE;
		const timeoutMs = getTimeoutForText(textLength);

		let translatedText: string;

		if (needsChunking) {
			console.log(`Text is long (${textLength} chars), using chunking approach`);

			// Split text into chunks
			const chunks = splitTextIntoChunks(cleanedText);
			console.log(`Split text into ${chunks.length} chunks`);

			// Translate each chunk
			const translatedChunks: string[] = [];
			for (let i = 0; i < chunks.length; i++) {
				const chunk = chunks[i];
				console.log(`Translating chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);

				try {
					const translatedChunk = await translateChunk(chunk, timeoutMs);
					translatedChunks.push(translatedChunk);
				} catch (error) {
					console.error(`Failed to translate chunk ${i + 1}:`, error);
					throw new Error(
						`Failed to translate chunk ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
					);
				}
			}

			// Combine translated chunks
			translatedText = translatedChunks.join('\n\n');
			console.log(`Successfully translated ${chunks.length} chunks`);
		} else {
			console.log(`Text is short (${textLength} chars), using single translation`);

			// Single translation for shorter texts
			const response = await Promise.race([
				retryWithBackoff(async () => {
					return await translatorAgent.generate(cleanedText);
				}),
				createTimeoutPromise(timeoutMs),
			]);

			// Validate response
			if (!response) {
				throw new Error('Received empty response from translator agent');
			}

			if (!response.text || typeof response.text !== 'string') {
				throw new Error('Invalid response format from translator agent');
			}

			translatedText = response.text.trim();

			if (translatedText === '') {
				throw new Error('Translation resulted in empty text');
			}
		}

		const processingTime = Date.now() - startTime;

		console.log(`Translation completed successfully in ${processingTime}ms`);

		return {
			success: true,
			translatedText,
			metadata: {
				originalLength: cleanedText.length,
				translatedLength: translatedText.length,
				processingTimeMs: processingTime,
			},
		};
	} catch (error) {
		const processingTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		console.error('Translation failed:', {
			error: errorMessage,
			processingTimeMs: processingTime,
			textLength: extractedText?.length || 0,
			timestamp: new Date().toISOString(),
		});

		// Determine error type and provide appropriate error message
		let userFriendlyError = 'Translation failed due to an unexpected error';

		if (error instanceof Error) {
			const errorMsg = error.message.toLowerCase();

			if (errorMsg.includes('timeout')) {
				userFriendlyError =
					'Translation request timed out. The text may be too long or complex. Please try again.';
			} else if (errorMsg.includes('network') || errorMsg.includes('connection')) {
				userFriendlyError = 'Network error occurred. Please check your connection and try again.';
			} else if (errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
				userFriendlyError =
					'Translation service is temporarily unavailable due to high demand. Please try again later.';
			} else if (errorMsg.includes('unauthorized') || errorMsg.includes('forbidden')) {
				userFriendlyError = 'Translation service authentication failed. Please contact support.';
			} else if (errorMsg.includes('invalid')) {
				userFriendlyError = 'Invalid input provided for translation.';
			} else if (errorMsg.includes('chunk')) {
				userFriendlyError = 'Translation failed while processing a section of the text. Please try again.';
			}
		}

		return {
			success: false,
			error: userFriendlyError,
			metadata: {
				originalLength: extractedText?.length || 0,
				translatedLength: 0,
				processingTimeMs: processingTime,
			},
		};
	}
}

// Export types for use in other modules
export type { TranslationResult, TranslationError };
