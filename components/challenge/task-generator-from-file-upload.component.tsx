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
import {
    AlertCircle, CheckCircle, Loader2, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { createTechChallenge } from '@/app/(users)/challenge/(for-companies)/generate/action';
import { FileTextExtractor } from '@/components/challenge';
import { type TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatTextToMarkdown } from '@/mastra/utils/format-text-to-markdown';
import {
    Card, CardContent, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { translateIssueDescriptionAction } from '@/app/actions/translate-issue-description.action';
import { getCompanyDescriptionAction } from '@/app/actions/get-company-description.action';
import { getUserData } from '@/app/actions/get-user-data.action';
import { saveChallengeDraftAction } from '@/app/actions/save-challenge-draft.action';
import { type UserProfileType } from '@/types/user-profile.type';
import * as print from '@/lib/print-helpers';

// Define the StackSelectionJson type locally to avoid importing Mastra utilities in client component
type StackSelectionJson = {
    role_title?               : string;
    seniority?                : 'junior' | 'mid' | 'senior';
    primary_stack?            : string[];
    secondary_stack?          : string[];
    domain?                   : string;
    difficulty?               : 'junior' | 'mid' | 'senior';
    focus_areas?              : string[];
    non_goals?                : string[];
    company_context_priority?: string;
    evaluation_mode?          : string;
    deliverable_format?       : string;
    output_language?          : string;
    privacy_constraints?      : string[];
    inclusion_requirements?   : string[];
    prohibited_items?         : string[];
    extra_credit_themes?      : string[];
    technical_stack?          : string[];
    issue_description?        : string;
    [key: string]             : any;
};

const formSchema = z.object({
    jobOfferFile     : z.instanceof(File).optional(),
    extractedText    : z.string().optional(),
    jsonConfig       : z.string().optional(),
    issueDescription : z.string().min(1, 'Issue description is required')
});

// Define the automated processing steps
type ProcessingStep = {
    id          : string;
    name        : string;
    description: string;
    status      : 'pending' | 'in_progress' | 'completed' | 'error';
    error?      : string;
};

type AutomatedProcessingState = {
    isProcessing: boolean;
    currentStep  : number;
    totalSteps   : number;
    steps        : ProcessingStep[];
    progress     : number;
    error        : string | undefined;
    result       : string | undefined;
};

export function TaskGeneratorFormFromFileUpload() {
    const router = useRouter();
    const [result, setResult] = useState<string | undefined>('');
    const [jsonConfig, setJsonConfig] = useState<string>('');
    const [extractedText, setExtractedText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [translationError, setTranslationError] = useState<string | undefined>('');
    const [isExtractingTechStack, setIsExtractingTechStack] = useState<boolean>(false);
    const [techStackError, setTechStackError] = useState<string | undefined>('');
    const [extractedTechStack, setExtractedTechStack] = useState<StackSelectionJson | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [user, setUser] = useState<UserProfileType | undefined>(undefined);
    const [savedChallengeId, setSavedChallengeId] = useState<string | undefined>('');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserData();
            setUser(user as UserProfileType);
        };

        fetchUser();
    }, []);

    // Automated processing state
    const [processingState, setProcessingState] = useState<AutomatedProcessingState>({
        isProcessing : false,
        currentStep  : 0,
        totalSteps   : 4,
        steps        : [
            {
                id          : 'extract',
                name        : 'Extract Text',
                description : 'Extracting text from uploaded file',
                status      : 'pending'
            },
            {
                id          : 'translate',
                name        : 'Translate Text',
                description : 'Translating extracted text to English',
                status      : 'pending'
            },
            {
                id          : 'tech_stack',
                name        : 'Extract Tech Stack',
                description : 'Analyzing and extracting technical requirements',
                status      : 'pending'
            },
            {
                id          : 'generate',
                name        : 'Generate Challenge',
                description : 'Creating the final technical challenge',
                status      : 'pending'
            }
        ],
        progress : 0,
        error    : '',
        result   : ''
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver      : zodResolver(formSchema),
        defaultValues : {
            jobOfferFile     : undefined,
            extractedText    : '',
            jsonConfig       : '',
            issueDescription : ''
        }
    });

    // Helper function to update processing state
    const updateProcessingState = (updates: Partial<AutomatedProcessingState>) => {
        setProcessingState((previous) => {
            const newState = {
                ...previous,
                ...updates
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
                steps : previous.steps.map((step) => {
                    return (step.id === stepId
                        ? {
                            ...step,
                            ...updates
                        }
                        : step);
                })
            };
        });
    };

    // Main automated processing function
    const handleAutomatedProcessing = async () => {
        if (!selectedFile) {
            updateProcessingState({ error : 'Please select a file first' });
            return;
        }

        if (!form.getValues('issueDescription')) {
            updateProcessingState({ error : 'Please describe the issue for which you want to generate a challenge' });
            return;
        }

        // Reset state and start processing
        updateProcessingState({
            isProcessing : true,
            currentStep  : 0,
            progress     : 0,
            error        : undefined,
            result       : undefined,
            steps        : processingState.steps.map((step) => {
                return {
                    ...step,
                    status : 'pending',
                    error  : undefined
                };
            })
        });

        try {
            // Step 1: Extract text from file
            updateStep('extract', { status : 'in_progress' });
            const formData = new FormData();
            formData.append('file', selectedFile);

            // ! TODO: update the fetch to use model or server action
            const extractResponse = await fetch('/api/extract-text', {
                method : 'POST',
                body   : formData
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
            form.setValue('extractedText', extractResult.extractedText);
            updateStep('extract', { status : 'completed' });

            // Step 2: Translate text
            updateStep('translate', { status : 'in_progress' });

            // ! TODO: update the fetch to use model or server action
            const translateResponse = await fetch('/api/translate-text', {
                method  : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body    : JSON.stringify({ text : extractResult.extractedText })
            });

            if (!translateResponse.ok) {
                const errorData = await translateResponse.json();
                throw new Error(errorData.error || 'Translation failed');
            }

            const { translatedText } = await translateResponse.json();
            setTranslatedText(translatedText);
            updateStep('translate', { status : 'completed' });

            // Step 3: Extract tech stack
            updateStep('tech_stack', { status : 'in_progress' });
            const formattedText = formatTextToMarkdown(translatedText);

            // ! TODO: update the fetch to use model or server action
            const techStackResponse = await fetch('/api/extract-tech-stack', {
                method  : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body    : JSON.stringify({
                    formattedText,
                    existingJsonConfig : jsonConfig,
                    issueDescription   : form.getValues('issueDescription')
                })
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
            updateStep('tech_stack', { status : 'completed' });

            // Step 4: Generate challenge
            updateStep('generate', { status : 'in_progress' });

            const companyDescription = await getCompanyDescriptionAction();

            const issueDescription = await translateIssueDescriptionAction(form.getValues('issueDescription'));

            // Check if company description exists and extract the description
            if (!companyDescription || companyDescription.length === 0) {
                throw new Error('No company found for the current user');
            }

            const challengeResult = await createTechChallenge(
                extractResult.extractedText,
                mergedJsonString,
                issueDescription,
                companyDescription[0]
            );
            setResult(challengeResult);
            updateStep('generate', { status : 'completed' });

            // Automatically save the challenge draft to database
            try {
                const saveResult = await saveChallengeDraftAction({
                    challengeDraft     : challengeResult,
                    extractedTechStack : techStackResult.techStack,
                    issueDescription   : form.getValues('issueDescription'),
                    github_url         : ''
                });

                if (saveResult.success) {
                    setSavedChallengeId(saveResult.challengeId);

                    // Automatically redirect to edit page
                    const redirectUrl = `/challenge/edit/${saveResult.challengeId}`;
                    setTimeout(() => {
                        router.push(redirectUrl);
                    }, 2000); // Give user 2 seconds to see the success message
                }
            }
            catch (saveError: any) {
                print.error('Failed to auto-save challenge:', saveError.message);
                // Don't fail the entire process if auto-save fails
            }

            // Mark processing as complete
            updateProcessingState({
                isProcessing : false,
                result       : challengeResult
            });
        }
        catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            updateProcessingState({
                isProcessing : false,
                error        : errorMessage
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
            isProcessing : false,
            currentStep  : 0,
            progress     : 0,
            error        : undefined,
            result       : undefined,
            steps        : processingState.steps.map((step) => {
                return {
                    ...step,
                    status : 'pending',
                    error  : undefined
                };
            })
        });
    };

    return (
        <>
            <Form {...form}>
                <form className="space-y-8 flex flex-col gap-4">
                    {/* File Upload Section */}
                    <FileTextExtractor onFileSelect={handleFileSelect} />

                    {/* Generate Challenge Button */}
                    {selectedFile && (
                        <>
                            <FormItem>
                                <FormLabel>Describe the issue for which you want to generate a challenge</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...form.register('issueDescription')}
                                        placeholder="Describe the issue for which you want to generate a challenge"
                                        className="h-24"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            <Card className="border-none">
                                <CardContent className="pt-6 border-none p-0">
                                    <Button
                                        type="button"
                                        onClick={handleAutomatedProcessing}
                                        disabled={processingState.isProcessing}
                                        className="w-full h-12 text-lg"
                                        size="lg"
                                    >
                                        {processingState.isProcessing
                                            ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Generating Challenge...
                                                </>
                                            )
                                            : (
                                                <>
                                                    <Zap className="h-5 w-5 mr-2" />
                                                    Generate Challenge
                                                </>
                                            )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Processing Progress */}
                    {processingState.isProcessing && (
                        <Card className="border-none">
                            <CardHeader className="border-none">
                                <CardTitle className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing Challenge Generation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 border-none p-0">
                                <Progress value={processingState.progress} className="w-full" />
                                <div className="text-sm text-muted-foreground">
                                    {Math.round(processingState.progress)}% Complete
                                </div>

                                <div className="space-y-3">
                                    {processingState.steps.map((step, index) => {
                                        return (
                                            <div key={step.id} className="flex items-center gap-3">
                                                {step.status === 'completed'
                                                    ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    )
                                                    : step.status === 'in_progress'
                                                        ? (
                                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                        )
                                                        : step.status === 'error'
                                                            ? (
                                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                            )
                                                            : (
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
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
                    {processingState.error && (
                        <Card className="border-none">
                            <CardContent className="pt-6 border-none">
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
                        <Card className="border-none">
                            <CardHeader className="border-none">
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    Challenge Generated Successfully
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="border-none p-0">
                                <div className="space-y-4">
                                    {/* Auto-save status */}
                                    {savedChallengeId && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="text-sm font-medium">
                                                    Challenge automatically saved!
                                                </span>
                                            </div>
                                            <div className="text-xs text-green-600 mt-1">
                                                Redirecting to edit page in a moment...
                                            </div>
                                        </div>
                                    )}

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
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </form>
            </Form>
        </>
    );
}
