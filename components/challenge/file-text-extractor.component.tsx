/*  FileTextExtractor Component
    A React component that provides a user interface for uploading files and extracting text content from them.
    Supports various file types including PDFs, Word documents, text files, and more. The component handles
    file upload, displays file metadata, and shows extraction results with detailed statistics like word count,
    character count, and page count. Users can view the extracted text in a collapsible section.
 */

'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FileUploaderComponent } from './file-uploader.component';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatFileSize } from '@/lib/file-utils';

type FileTextExtractorProps = {
    onTextExtracted?: (result: TextExtractionResult) => void;
    onFileSelect?: (file: File | undefined) => void;
    className?: string;
};

export const FileTextExtractor = ({
    onTextExtracted,
    onFileSelect,
    className,
}: FileTextExtractorProps) => {
    // State for the currently selected file
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
        undefined,
    );

    // State for storing text extraction results
    const [extractionResult, setExtractionResult] = useState<
        TextExtractionResult | undefined
    >(undefined);

    // State to track extraction loading state
    const [isExtracting, setIsExtracting] = useState(false);

    // Handle file selection and reset previous results
    const handleFileSelect = (file: File | undefined) => {
        setSelectedFile(file);
        setExtractionResult(undefined);
        onFileSelect?.(file);
    };

    // Main function to handle text extraction from uploaded file
    const handleExtractText = async () => {
        if (!selectedFile) {
            return;
        }

        setIsExtracting(true);
        try {
            // Create FormData to send file to API
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Call the text extraction API endpoint
            const response = await fetch('/api/extract-text', {
                method: 'POST',
                body: formData,
            });

            // Handle API errors
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to extract text');
            }

            // Parse successful response and update state
            const result: TextExtractionResult = await response.json();

            setExtractionResult(result);

            // Notify parent component of successful extraction
            onTextExtracted?.(result);
        } catch (error) {
            console.error('Text extraction failed:', error);

            // Create error result object for display
            setExtractionResult({
                success: false,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                fileSize: selectedFile.size,
                extractedText: '',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
            });
        } finally {
            // Always reset loading state
            setIsExtracting(false);
        }
    };

    return (
        <div className={className}>
            <div className='space-y-6'>
                {/* File upload component with size limit */}
                <FileUploaderComponent
                    onFileSelect={handleFileSelect}
                    maxFileSize={50} // 50MB
                    disabled={isExtracting}
                />

                {/* Display extraction results if available */}
                {extractionResult && (
                    <Card
                        className={
                            extractionResult.success
                                ? 'border border-green-200/60 bg-green-50/30 backdrop-blur-sm shadow-sm' // Green styling for success
                                : 'border border-red-200/60 bg-red-50/30 backdrop-blur-sm shadow-sm' // Red styling for errors
                        }
                    >
                        <CardContent className='p-6'>
                            <div className='flex items-start gap-4'>
                                {/* Success/error icon */}
                                {extractionResult.success ? (
                                    <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-sm flex-shrink-0'>
                                        <CheckCircle className='h-5 w-5' />
                                    </div>
                                ) : (
                                    <div className='bg-gradient-to-br from-red-400 to-red-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-sm flex-shrink-0'>
                                        <AlertCircle className='h-5 w-5' />
                                    </div>
                                )}
                                <div className='flex-1 space-y-3'>
                                    {/* Status message and extraction method badge */}
                                    <div className='flex items-center gap-3'>
                                        <span className='font-semibold text-gray-900'>
                                            {extractionResult.success
                                                ? 'Text Extracted Successfully'
                                                : 'Extraction Failed'}
                                        </span>
                                        {/* Show extraction method if available */}
                                        {extractionResult.metadata
                                            ?.extractionMethod && (
                                            <Badge
                                                variant='outline'
                                                className='text-xs px-2 py-1 border-cyan-400/50 text-cyan-600 bg-cyan-400/10'
                                            >
                                                {
                                                    extractionResult.metadata
                                                        .extractionMethod
                                                }
                                            </Badge>
                                        )}
                                    </div>

                                    {extractionResult.success ? (
                                        <div className='space-y-4'>
                                            {/* Grid layout for extraction metadata stats */}
                                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                                {/* Word count display */}
                                                {extractionResult.metadata
                                                    ?.wordCount && (
                                                    <div className='bg-white/60 rounded-lg p-3 border border-gray-200/60'>
                                                        <div className='text-xs text-gray-500 mb-1'>
                                                            Words
                                                        </div>
                                                        <div className='text-lg font-semibold text-gray-900'>
                                                            {
                                                                extractionResult
                                                                    .metadata
                                                                    .wordCount
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Character count display */}
                                                {extractionResult.metadata
                                                    ?.charCount && (
                                                    <div className='bg-white/60 rounded-lg p-3 border border-gray-200/60'>
                                                        <div className='text-xs text-gray-500 mb-1'>
                                                            Characters
                                                        </div>
                                                        <div className='text-lg font-semibold text-gray-900'>
                                                            {
                                                                extractionResult
                                                                    .metadata
                                                                    .charCount
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Page count display for documents */}
                                                {extractionResult.metadata
                                                    ?.pagesCount && (
                                                    <div className='bg-white/60 rounded-lg p-3 border border-gray-200/60'>
                                                        <div className='text-xs text-gray-500 mb-1'>
                                                            Pages
                                                        </div>
                                                        <div className='text-lg font-semibold text-gray-900'>
                                                            {
                                                                extractionResult
                                                                    .metadata
                                                                    .pagesCount
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Sheet count display for spreadsheets */}
                                                {extractionResult.metadata
                                                    ?.sheetsCount && (
                                                    <div className='bg-white/60 rounded-lg p-3 border border-gray-200/60'>
                                                        <div className='text-xs text-gray-500 mb-1'>
                                                            Sheets
                                                        </div>
                                                        <div className='text-lg font-semibold text-gray-900'>
                                                            {
                                                                extractionResult
                                                                    .metadata
                                                                    .sheetsCount
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Collapsible text viewer section */}
                                            <div className='mt-4'>
                                                <details className='group'>
                                                    {/* Clickable summary with character count */}
                                                    <summary className='cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2'>
                                                        <span>
                                                            View Extracted Text
                                                        </span>
                                                        <Badge
                                                            variant='outline'
                                                            className='text-xs px-2 py-1 border-gray-300/50 text-gray-600 bg-gray-50/80'
                                                        >
                                                            {
                                                                extractionResult
                                                                    .extractedText
                                                                    .length
                                                            }{' '}
                                                            characters
                                                        </Badge>
                                                    </summary>
                                                    {/* Scrollable text content area */}
                                                    <div className='mt-3 p-4 bg-white/60 rounded-lg border border-gray-200/60 max-h-60 overflow-y-auto'>
                                                        <pre className='text-sm whitespace-pre-wrap break-words text-gray-800 leading-relaxed'>
                                                            {
                                                                extractionResult.extractedText
                                                            }
                                                        </pre>
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='text-sm text-red-600 bg-red-50/50 rounded-lg p-3 border border-red-200/60'>
                                            {/* Error message display */}
                                            {extractionResult.error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
