/**
 * TaskGeneratorFormFromFileUpload Component
 *
 * An automated challenge generation component that processes job offer files through a complete pipeline:
 * 1. File upload and text extraction from various document formats (PDF, DOCX, TXT, etc.)
 * 2. Automatic translation of extracted text to English for better processing
 * 3. AI-powered tech stack extraction and analysis of job requirements
 * 4. Generation of customized technical challenges based on the extracted requirements
 *
 * The component provides a streamlined user experience with a single "Generate Challenge" button
 * that runs all processing steps in the background, showing real-time progress and detailed
 * status updates for each step. Users can upload a job offer file and receive a complete
 * technical challenge without manual intervention.
 *
 * Features:
 * - Supports multiple file formats (PDF, DOCX, TXT, XLSX, etc.)
 * - Real-time progress tracking with visual indicators
 * - Comprehensive error handling and user feedback
 * - Automatic tech stack extraction and requirement analysis
 * - Clean, card-based UI with detailed results display
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { createTechChallenge } from '@/app/(users)/challenge/(for-companies)/generate/action';
import { useState } from 'react';
import { FileTextExtractor } from '@/components/file-text-extractor.component';
import { TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatTextToMarkdown } from '@/mastra/utils/format-text-to-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, FileText, Zap } from 'lucide-react';

// Define the StackSelectionJson type locally to avoid importing Mastra utilities in client component
interface StackSelectionJson {
	role_title?: string;
	seniority?: 'junior' | 'mid' | 'senior';
	primary_stack?: string[];
	secondary_stack?: string[];
	domain?: string;
	difficulty?: 'junior' | 'mid' | 'senior';
	focus_areas?: string[];
	non_goals?: string[];
	company_context_priority?: string;
	evaluation_mode?: string;
	deliverable_format?: string;
	output_language?: string;
	privacy_constraints?: string[];
	inclusion_requirements?: string[];
	prohibited_items?: string[];
	extra_credit_themes?: string[];
	technical_stack?: string[];
	[key: string]: any;
}

const formSchema = z.object({
	jobOfferFile: z.instanceof(File).optional(),
	extractedText: z.string().optional(),
	jsonConfig: z.string().optional(),
});

// Define the automated processing steps
interface ProcessingStep {
	id: string;
	name: string;
	description: string;
	status: 'pending' | 'in_progress' | 'completed' | 'error';
	error?: string;
}

interface AutomatedProcessingState {
	isProcessing: boolean;
	currentStep: number;
	totalSteps: number;
	steps: ProcessingStep[];
	progress: number;
	error: string | null;
	result: string | null;
}

export function TaskGeneratorFormFromFileUpload() {
	const [result, setResult] = useState<string | null>(null);
	const [jsonConfig, setJsonConfig] = useState<string>('');
	const [extractedText, setExtractedText] = useState<string>('');
	const [translatedText, setTranslatedText] = useState<string>('');
	const [isTranslating, setIsTranslating] = useState<boolean>(false);
	const [translationError, setTranslationError] = useState<string | null>(null);
	const [isExtractingTechStack, setIsExtractingTechStack] = useState<boolean>(false);
	const [techStackError, setTechStackError] = useState<string | null>(null);
	const [extractedTechStack, setExtractedTechStack] = useState<StackSelectionJson | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Automated processing state
	const [processingState, setProcessingState] = useState<AutomatedProcessingState>({
		isProcessing: false,
		currentStep: 0,
		totalSteps: 4,
		steps: [
			{
				id: 'extract',
				name: 'Extract Text',
				description: 'Extracting text from uploaded file',
				status: 'pending',
			},
			{
				id: 'translate',
				name: 'Translate Text',
				description: 'Translating extracted text to English',
				status: 'pending',
			},
			{
				id: 'tech_stack',
				name: 'Extract Tech Stack',
				description: 'Analyzing and extracting technical requirements',
				status: 'pending',
			},
			{
				id: 'generate',
				name: 'Generate Challenge',
				description: 'Creating the final technical challenge',
				status: 'pending',
			},
		],
		progress: 0,
		error: null,
		result: null,
	});

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobOfferFile: undefined,
			extractedText: '',
			jsonConfig: '',
		},
	});

	// Helper function to update processing state
	const updateProcessingState = (updates: Partial<AutomatedProcessingState>) => {
		setProcessingState((prev) => {
			const newState = { ...prev, ...updates };
			// Calculate progress based on completed steps
			const completedSteps = newState.steps.filter((step) => step.status === 'completed').length;
			newState.progress = (completedSteps / newState.totalSteps) * 100;
			return newState;
		});
	};

	// Helper function to update a specific step
	const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
		setProcessingState((prev) => ({
			...prev,
			steps: prev.steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)),
		}));
	};

	// Main automated processing function
	const handleAutomatedProcessing = async () => {
		if (!selectedFile) {
			updateProcessingState({ error: 'Please select a file first' });
			return;
		}

		// Reset state and start processing
		updateProcessingState({
			isProcessing: true,
			currentStep: 0,
			progress: 0,
			error: null,
			result: null,
			steps: processingState.steps.map((step) => ({ ...step, status: 'pending', error: undefined })),
		});

		try {
			// Step 1: Extract text from file
			updateStep('extract', { status: 'in_progress' });
			const formData = new FormData();
			formData.append('file', selectedFile);

			const extractResponse = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			if (!extractResponse.ok) {
				const errorData = await extractResponse.json();
				throw new Error(errorData.error || 'Failed to extract text');
			}

			const extractResult: TextExtractionResult = await extractResponse.json();
			if (!extractResult.success) {
				throw new Error(extractResult.error || 'Text extraction failed');
			}

			setExtractedText(extractResult.extractedText);
			updateStep('extract', { status: 'completed' });

			// Step 2: Translate text
			updateStep('translate', { status: 'in_progress' });
			const translateResponse = await fetch('/api/translate-text', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: extractResult.extractedText }),
			});

			if (!translateResponse.ok) {
				const errorData = await translateResponse.json();
				throw new Error(errorData.error || 'Translation failed');
			}

			const { translatedText } = await translateResponse.json();
			setTranslatedText(translatedText);
			updateStep('translate', { status: 'completed' });

			// Step 3: Extract tech stack
			updateStep('tech_stack', { status: 'in_progress' });
			const formattedText = formatTextToMarkdown(translatedText);

			const techStackResponse = await fetch('/api/extract-tech-stack', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					formattedText,
					existingJsonConfig: jsonConfig,
				}),
			});

			if (!techStackResponse.ok) {
				const errorData = await techStackResponse.json();
				throw new Error(errorData.error || 'Tech stack extraction failed');
			}

			const techStackResult = await techStackResponse.json();
			if (!techStackResult.success) {
				throw new Error(techStackResult.error || 'Failed to extract tech stack');
			}

			setExtractedTechStack(techStackResult.techStack);
			const mergedJsonString = JSON.stringify(techStackResult.techStack, null, 2);
			setJsonConfig(mergedJsonString);
			updateStep('tech_stack', { status: 'completed' });

			// Step 4: Generate challenge
			updateStep('generate', { status: 'in_progress' });
			const challengeResult = await createTechChallenge(extractResult.extractedText, mergedJsonString);
			setResult(challengeResult);
			updateStep('generate', { status: 'completed' });

			// Mark processing as complete
			updateProcessingState({
				isProcessing: false,
				result: challengeResult,
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			updateProcessingState({
				isProcessing: false,
				error: errorMessage,
			});
			console.error('Automated processing failed:', error);
		}
	};

	// Handle file selection from FileTextExtractor
	const handleFileSelect = (file: File | null) => {
		setSelectedFile(file);
		// Reset all states when a new file is selected
		setExtractedText('');
		setTranslatedText('');
		setJsonConfig('');
		setExtractedTechStack(null);
		setResult(null);
		setTranslationError(null);
		setTechStackError(null);
		updateProcessingState({
			isProcessing: false,
			currentStep: 0,
			progress: 0,
			error: null,
			result: null,
			steps: processingState.steps.map((step) => ({ ...step, status: 'pending', error: undefined })),
		});
	};

	return (
		<>
			<Form {...form}>
				<form className="space-y-8 flex flex-col gap-4">
					{/* File Upload Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Upload Job Offer File
							</CardTitle>
						</CardHeader>
						<CardContent>
							<FileTextExtractor onFileSelect={handleFileSelect} />
						</CardContent>
					</Card>

					{/* Generate Challenge Button */}
					{selectedFile && (
						<Card>
							<CardContent className="pt-6">
								<Button
									type="button"
									onClick={handleAutomatedProcessing}
									disabled={processingState.isProcessing}
									className="w-full h-12 text-lg"
									size="lg"
								>
									{processingState.isProcessing ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin mr-2" />
											Generating Challenge...
										</>
									) : (
										<>
											<Zap className="h-5 w-5 mr-2" />
											Generate Challenge
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Processing Progress */}
					{processingState.isProcessing && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Loader2 className="h-5 w-5 animate-spin" />
									Processing Challenge Generation
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Progress value={processingState.progress} className="w-full" />
								<div className="text-sm text-muted-foreground">
									{Math.round(processingState.progress)}% Complete
								</div>

								<div className="space-y-3">
									{processingState.steps.map((step, index) => (
										<div key={step.id} className="flex items-center gap-3">
											{step.status === 'completed' ? (
												<CheckCircle className="h-4 w-4 text-green-500" />
											) : step.status === 'in_progress' ? (
												<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
											) : step.status === 'error' ? (
												<AlertCircle className="h-4 w-4 text-red-500" />
											) : (
												<div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
											)}
											<div className="flex-1">
												<div className="text-sm font-medium">{step.name}</div>
												<div className="text-xs text-muted-foreground">{step.description}</div>
												{step.error && (
													<div className="text-xs text-red-600 mt-1">{step.error}</div>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Error Display */}
					{processingState.error && (
						<Card className="border-red-200 bg-red-50/50">
							<CardContent className="pt-6">
								<div className="flex items-center gap-2 text-red-600">
									<AlertCircle className="h-5 w-5" />
									<span className="font-medium">Processing Error</span>
								</div>
								<p className="text-sm text-red-600 mt-2">{processingState.error}</p>
							</CardContent>
						</Card>
					)}

					{/* Results Display */}
					{processingState.result && (
						<Card className="border-green-200 bg-green-50/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-600">
									<CheckCircle className="h-5 w-5" />
									Challenge Generated Successfully
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{/* Extracted Tech Stack Summary */}
									{extractedTechStack && (
										<div className="p-3 bg-background rounded-md">
											<h4 className="font-medium text-sm mb-2">Extracted Requirements:</h4>
											<div className="text-xs text-muted-foreground space-y-1">
												<div>Role: {extractedTechStack.role_title || 'Not specified'}</div>
												<div>Seniority: {extractedTechStack.seniority || 'Not specified'}</div>
												<div>
													Technologies: {extractedTechStack.technical_stack?.length || 0}{' '}
													identified
												</div>
											</div>
										</div>
									)}

									{/* Generated Challenge */}
									<div className="p-4 bg-background rounded-md max-h-96 overflow-y-auto">
										<pre className="text-sm whitespace-pre-wrap break-words">
											{processingState.result}
										</pre>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</form>
			</Form>
		</>
	);
}
