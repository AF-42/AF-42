/**
 * TaskGeneratorFormFromFileUpload Component
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
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { createTechChallenge } from '@/app/(users)/challenge/(for-companies)/generate/action';
import { FileTextExtractor } from '@/components/challenge';
import { type TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatTextToMarkdown } from '@/mastra/utils/format-text-to-markdown';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { translateIssueDescriptionAction } from '@/app/actions/translate-issue-description.action';
import { getCompanyDescriptionAction } from '@/app/actions/get-company-description.action';
import { getUserData } from '@/app/actions/get-user-data.action';
import { saveChallengeDraftAction } from '@/app/actions/save-challenge-draft.action';
import { type UserProfileType } from '@/types/user-profile.type';
import * as print from '@/lib/print-helpers';

// Define the StackSelectionJson type locally to avoid importing Mastra utilities in client component
type StackSelectionJson = {
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
    issue_description?: string;
    [key: string]: any;
};

const formSchema = z.object({
    jobOfferFile: z.instanceof(File).optional(),
    extractedText: z.string().optional(),
    jsonConfig: z.string().optional(),
    issueDescription: z.string().min(1, 'Issue description is required'),
});

// Define the automated processing steps
type ProcessingStep = {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    error?: string;
};

type AutomatedProcessingState = {
    isProcessing: boolean;
    currentStep: number;
    totalSteps: number;
    steps: ProcessingStep[];
    progress: number;
    error: string | undefined;
    result: string | undefined;
};

export function TaskGeneratorFormFromFileUpload() {
    const router = useRouter();
    const [result, setResult] = useState<string | undefined>('');
    const [jsonConfig, setJsonConfig] = useState<string>('');
    const [extractedText, setExtractedText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [translationError, setTranslationError] = useState<
        string | undefined
    >('');
    const [isExtractingTechStack, setIsExtractingTechStack] =
        useState<boolean>(false);
    const [techStackError, setTechStackError] = useState<string | undefined>(
        '',
    );
    const [extractedTechStack, setExtractedTechStack] = useState<
        StackSelectionJson | undefined
    >(undefined);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
        undefined,
    );
    const [user, setUser] = useState<UserProfileType | undefined>(undefined);
    const [savedChallengeId, setSavedChallengeId] = useState<
        string | undefined
    >('');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();
            setUser(user as UserProfileType);
        };

        fetchUser();
    }, []);

    // Automated processing state
    const [processingState, setProcessingState] =
        useState<AutomatedProcessingState>({
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
                    description:
                        'Analyzing and extracting technical requirements',
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
            error: '',
            result: '',
        });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobOfferFile: undefined,
            extractedText: '',
            jsonConfig: '',
            issueDescription: '',
        },
    });

    // Helper function to update processing state
    const updateProcessingState = (
        updates: Partial<AutomatedProcessingState>,
    ) => {
        setProcessingState((previous) => {
            const newState = {
                ...previous,
                ...updates,
            };
            // Calculate progress based on completed steps
            const completedSteps = newState.steps.filter((step) => {
                return step.status === 'completed';
            }).length;
            newState.progress = (completedSteps / newState.totalSteps) * 100;
            return newState;
        });
    };

    // Helper function to update a specific step
    const updateStep = (stepId: string, updates: Partial<ProcessingStep>) => {
        setProcessingState((previous) => {
            return {
                ...previous,
                steps: previous.steps.map((step) => {
                    return step.id === stepId
                        ? {
                              ...step,
                              ...updates,
                          }
                        : step;
                }),
            };
        });
    };

    // Main automated processing function
    const handleAutomatedProcessing = async () => {
        if (!selectedFile) {
            updateProcessingState({ error: 'Please select a file first' });
            return;
        }

        if (!form.getValues('issueDescription')) {
            updateProcessingState({
                error: 'Please describe the issue for which you want to generate a challenge',
            });
            return;
        }

        // Reset state and start processing
        updateProcessingState({
            isProcessing: true,
            currentStep: 0,
            progress: 0,
            error: undefined,
            result: undefined,
            steps: processingState.steps.map((step) => {
                return {
                    ...step,
                    status: 'pending',
                    error: undefined,
                };
            }),
        });

        try {
            // Step 1: Extract text from file
            updateStep('extract', { status: 'in_progress' });
            const formData = new FormData();
            formData.append('file', selectedFile);

            // ! TODO: update the fetch to use model or server action
            const extractResponse = await fetch('/api/extract-text', {
                method: 'POST',
                body: formData,
            });

            if (!extractResponse.ok) {
                const errorData = await extractResponse.json();
                throw new Error(errorData.error || 'Failed to extract text');
            }

            const extractResult: TextExtractionResult =
                await extractResponse.json();
            if (!extractResult.success) {
                throw new Error(
                    extractResult.error || 'Text extraction failed',
                );
            }

            setExtractedText(extractResult.extractedText);
            form.setValue('extractedText', extractResult.extractedText);
            updateStep('extract', { status: 'completed' });

            // Step 2: Translate text
            updateStep('translate', { status: 'in_progress' });

            // ! TODO: update the fetch to use model or server action
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

            // ! TODO: update the fetch to use model or server action
            const techStackResponse = await fetch('/api/extract-tech-stack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formattedText,
                    existingJsonConfig: jsonConfig,
                    issueDescription: form.getValues('issueDescription'),
                }),
            });

            if (!techStackResponse.ok) {
                const errorData = await techStackResponse.json();
                throw new Error(
                    errorData.error || 'Tech stack extraction failed',
                );
            }

            const techStackResult = await techStackResponse.json();
            if (!techStackResult.success) {
                throw new Error(
                    techStackResult.error || 'Failed to extract tech stack',
                );
            }

            setExtractedTechStack(techStackResult.techStack);
            const mergedJsonString = JSON.stringify(
                techStackResult.techStack,
                null,
                2,
            );
            setJsonConfig(mergedJsonString);
            updateStep('tech_stack', { status: 'completed' });

            // Step 4: Generate challenge
            updateStep('generate', { status: 'in_progress' });
            //
            const companyDescription = await getCompanyDescriptionAction();

            const issueDescription = await translateIssueDescriptionAction(
                form.getValues('issueDescription'),
            );

            // Check if company description exists and extract the description
            if (!companyDescription || companyDescription.length === 0) {
                throw new Error('No company found for the current user');
            }

            const challengeResult = await createTechChallenge(
                extractResult.extractedText,
                mergedJsonString,
                issueDescription,
                companyDescription[0],
            );
            setResult(challengeResult);
            updateStep('generate', { status: 'completed' });

            // Automatically save the challenge draft to database
            try {
                const saveResult = await saveChallengeDraftAction({
                    challengeDraft: challengeResult,
                    extractedTechStack: techStackResult.techStack,
                    issueDescription: form.getValues('issueDescription'),
                    github_url: '',
                });

                if (saveResult.success) {
                    setSavedChallengeId(saveResult.challengeId);

                    // Automatically redirect to edit page
                    const redirectUrl = `/challenge/${saveResult.challengeId}/edit`;
                    setTimeout(() => {
                        router.push(redirectUrl);
                    }, 2000); // Give user 2 seconds to see the success message
                }
            } catch (saveError: any) {
                print.error(
                    'Failed to auto-save challenge:',
                    saveError.message,
                );
                // Don't fail the entire process if auto-save fails
            }

            // Mark processing as complete
            updateProcessingState({
                isProcessing: false,
                result: challengeResult,
            });
        } catch (error: any) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            updateProcessingState({
                isProcessing: false,
                error: errorMessage,
            });
            print.error('Automated processing failed:', error.message);
        }
    };

    // Handle file selection from FileTextExtractor
    const handleFileSelect = (file: File | undefined) => {
        setSelectedFile(file);
        // Reset all states when a new file is selected
        setExtractedText('');
        setTranslatedText('');
        setJsonConfig('');
        setExtractedTechStack(undefined);
        setResult(undefined);
        setTranslationError(undefined);
        setTechStackError(undefined);
        updateProcessingState({
            isProcessing: false,
            currentStep: 0,
            progress: 0,
            error: undefined,
            result: undefined,
            steps: processingState.steps.map((step) => {
                return {
                    ...step,
                    status: 'pending',
                    error: undefined,
                };
            }),
        });
    };

    return (
        <>
            <Form {...form}>
                <form className='space-y-8 flex flex-col gap-4'>
                    {/* File Upload Section */}
                    <div className='space-y-6'>
                        <FileTextExtractor onFileSelect={handleFileSelect} />
                    </div>

                    {/* Generate Challenge Button */}
                    {selectedFile && (
                        <div className='space-y-6'>
                            <FormItem>
                                <FormLabel className='text-lg font-semibold text-gray-900 flex items-center gap-3'>
                                    <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm'>
                                        <Zap className='h-4 w-4' />
                                    </div>
                                    Describe the issue for which you want to
                                    generate a challenge
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...form.register('issueDescription')}
                                        placeholder='Describe the issue for which you want to generate a challenge...'
                                        className='min-h-[120px] resize-none rounded-xl border-gray-200 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                            <div className='relative'>
                                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl blur-sm'></div>
                                <div className='relative'>
                                    <Button
                                        type='button'
                                        onClick={handleAutomatedProcessing}
                                        disabled={processingState.isProcessing}
                                        className='w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl'
                                        size='lg'
                                    >
                                        {processingState.isProcessing ? (
                                            <>
                                                <Loader2 className='h-6 w-6 animate-spin mr-3' />
                                                Generating Challenge...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className='h-6 w-6 mr-3' />
                                                Generate Challenge
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processing Progress */}
                    {processingState.isProcessing && (
                        <Card className='bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden'>
                            <CardHeader className='bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60 p-6'>
                                <CardTitle className='flex items-center gap-4 text-xl font-bold text-gray-900'>
                                    <div className='bg-gradient-to-br from-blue-500 to-purple-600 text-white flex aspect-square size-12 items-center justify-center rounded-xl shadow-lg'>
                                        <Loader2 className='h-6 w-6 animate-spin' />
                                    </div>
                                    Processing Challenge Generation
                                </CardTitle>
                                <CardDescription className='text-lg text-gray-600 font-medium'>
                                    {Math.round(processingState.progress)}%
                                    Complete
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='p-6 space-y-6'>
                                {/* Progress Bar */}
                                <div className='space-y-4'>
                                    <div className='relative'>
                                        <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                                            <div
                                                className='bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${processingState.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-600/20 rounded-full'></div>
                                    </div>
                                    <div className='flex justify-between text-base text-gray-600 font-medium'>
                                        <span>Processing steps...</span>
                                        <span>
                                            {Math.round(
                                                processingState.progress,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Steps List */}
                                <div className='space-y-4'>
                                    {processingState.steps.map(
                                        (step, index) => {
                                            return (
                                                <div
                                                    key={step.id}
                                                    className='flex items-start gap-4 p-4 rounded-xl border border-gray-200/60 bg-gray-50/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md'
                                                >
                                                    {/* Step Icon */}
                                                    <div className='flex-shrink-0 mt-1'>
                                                        {step.status ===
                                                        'completed' ? (
                                                            <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg'>
                                                                <CheckCircle className='h-5 w-5' />
                                                            </div>
                                                        ) : step.status ===
                                                          'in_progress' ? (
                                                            <div className='bg-gradient-to-br from-blue-500 to-purple-600 text-white flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg'>
                                                                <Loader2 className='h-5 w-5 animate-spin' />
                                                            </div>
                                                        ) : step.status ===
                                                          'error' ? (
                                                            <div className='bg-gradient-to-br from-red-400 to-red-600 text-white flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg'>
                                                                <AlertCircle className='h-5 w-5' />
                                                            </div>
                                                        ) : (
                                                            <div className='bg-gray-200 flex aspect-square size-10 items-center justify-center rounded-xl border-2 border-gray-300/50'>
                                                                <div className='h-3 w-3 rounded-full bg-gray-400' />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Step Content */}
                                                    <div className='flex-1 min-w-0'>
                                                        <div className='flex items-center gap-3 mb-2'>
                                                            <h4 className='text-base font-semibold text-gray-900'>
                                                                {step.name}
                                                            </h4>
                                                            {step.status ===
                                                                'completed' && (
                                                                <Badge className='bg-green-100 text-green-700 border-green-200 text-xs px-3 py-1'>
                                                                    Complete
                                                                </Badge>
                                                            )}
                                                            {step.status ===
                                                                'in_progress' && (
                                                                <Badge className='bg-blue-100 text-blue-700 border-blue-200 text-xs px-3 py-1'>
                                                                    Processing
                                                                </Badge>
                                                            )}
                                                            {step.status ===
                                                                'error' && (
                                                                <Badge className='bg-red-100 text-red-700 border-red-200 text-xs px-3 py-1'>
                                                                    Error
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className='text-sm text-gray-600 mb-2 leading-relaxed'>
                                                            {step.description}
                                                        </p>
                                                        {step.error && (
                                                            <div className='text-sm text-red-700 bg-red-50/80 rounded-lg p-3 border border-red-200/60'>
                                                                {step.error}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
                    {processingState.error && (
                        <Card className='bg-red-50/80 backdrop-blur-sm shadow-xl rounded-2xl border-red-200 overflow-hidden'>
                            <CardContent className='p-6'>
                                <div className='flex items-start gap-4'>
                                    <div className='bg-gradient-to-br from-red-400 to-red-600 text-white flex aspect-square size-12 items-center justify-center rounded-xl shadow-lg flex-shrink-0'>
                                        <AlertCircle className='h-6 w-6' />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-xl font-bold text-red-900 mb-3'>
                                            Processing Error
                                        </h3>
                                        <p className='text-base text-red-700 bg-red-100/80 rounded-xl p-4 border border-red-200/60 leading-relaxed'>
                                            {processingState.error}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Results Display */}
                    {processingState.result && (
                        <Card className='bg-green-50/80 backdrop-blur-sm shadow-xl rounded-2xl border-green-200 overflow-hidden'>
                            <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/60 p-6'>
                                <CardTitle className='flex items-center gap-4 text-xl font-bold text-green-900'>
                                    <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-12 items-center justify-center rounded-xl shadow-lg'>
                                        <CheckCircle className='h-6 w-6' />
                                    </div>
                                    Challenge Generated Successfully
                                </CardTitle>
                                <CardDescription className='text-lg text-green-700 font-medium'>
                                    Your technical challenge is ready
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='p-6 space-y-6'>
                                {/* Auto-save status */}
                                {savedChallengeId && (
                                    <div className='p-6 bg-green-100/80 border border-green-200/60 rounded-xl'>
                                        <div className='flex items-center gap-4'>
                                            <CheckCircle className='h-6 w-6 text-green-600' />
                                            <div>
                                                <div className='text-base font-semibold text-green-800'>
                                                    Challenge automatically
                                                    saved!
                                                </div>
                                                <div className='text-sm text-green-700 mt-1'>
                                                    Redirecting to edit page in
                                                    a moment...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Extracted Tech Stack Summary */}
                                {extractedTechStack && (
                                    <div className='p-6 bg-white/80 rounded-xl border border-gray-200/60'>
                                        <h4 className='font-bold text-gray-900 mb-4 flex items-center gap-3'>
                                            <div className='bg-gradient-to-br from-blue-400 to-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm'>
                                                <Zap className='h-4 w-4' />
                                            </div>
                                            Extracted Requirements
                                        </h4>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                            <div className='bg-gray-50/80 rounded-lg p-4 border border-gray-200/60'>
                                                <div className='text-sm text-gray-500 mb-2 font-medium'>
                                                    Role
                                                </div>
                                                <div className='text-base font-semibold text-gray-900'>
                                                    {extractedTechStack.role_title ??
                                                        'Not specified'}
                                                </div>
                                            </div>
                                            <div className='bg-gray-50/80 rounded-lg p-4 border border-gray-200/60'>
                                                <div className='text-sm text-gray-500 mb-2 font-medium'>
                                                    Seniority
                                                </div>
                                                <div className='text-base font-semibold text-gray-900'>
                                                    {extractedTechStack.seniority ??
                                                        'Not specified'}
                                                </div>
                                            </div>
                                            <div className='bg-gray-50/80 rounded-lg p-4 border border-gray-200/60'>
                                                <div className='text-sm text-gray-500 mb-2 font-medium'>
                                                    Technologies
                                                </div>
                                                <div className='text-base font-semibold text-gray-900'>
                                                    {extractedTechStack
                                                        .technical_stack
                                                        ?.length ?? 0}{' '}
                                                    identified
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </form>
            </Form>
        </>
    );
}
