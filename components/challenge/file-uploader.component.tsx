'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle, type File, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FileUploaderProps = {
    onFileSelect: (file: File | undefined) => void;
    acceptedFileTypes?: Record<string, string[]>;
    maxFileSize?: number; // In MB
    className?: string;
    disabled?: boolean;
};

const DEFAULT_ACCEPTED_TYPES = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
    ],
    'text/plain': ['.txt'],
    'text/markdown': ['.md'],
    'application/json': ['.json'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
    ],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
    'image/jpeg': ['.jpg', '.jpeg'],
};

export const FileUploaderComponent = ({
    onFileSelect,
    acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
    maxFileSize = 10, // 10MB default
    className,
    disabled = false,
}: FileUploaderProps) => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError(undefined);

            if (rejectedFiles.length > 0) {
                const rejection = rejectedFiles[0];
                if (rejection.errors[0]?.code === 'file-too-large') {
                    setError(`File size must be less than ${maxFileSize}MB`);
                } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                    setError('File type not supported');
                } else {
                    setError('File upload failed');
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setUploadedFile(file);
                onFileSelect(file);
            }
        },
        [onFileSelect, maxFileSize],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes as any,
        maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
        multiple: false,
        disabled,
    });

    const removeFile = () => {
        setUploadedFile(undefined);
        setError(undefined);
        onFileSelect(undefined);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': {
                return '📄';
            }
            case 'doc':
            case 'docx': {
                return '📝';
            }
            case 'txt':
            case 'md': {
                return '📄';
            }
            case 'json': {
                return '📋';
            }
            case 'xls':
            case 'xlsx': {
                return '📊';
            }
            case 'ppt':
            case 'pptx': {
                return '📽️';
            }
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp': {
                return '🖼️';
            }
            default: {
                return '📁';
            }
        }
    };

    return (
        <div className={cn('w-full', className)}>
            {uploadedFile ? (
                <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200'>
                    <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-sm'>
                                    <span className='text-lg'>
                                        {getFileIcon(uploadedFile)}
                                    </span>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-900 truncate'>
                                        {uploadedFile.name}
                                    </p>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <Badge
                                            variant='outline'
                                            className='text-xs px-2 py-0.5 h-5 border-gray-300/50 text-gray-600 bg-gray-50/80'
                                        >
                                            {formatFileSize(uploadedFile.size)}
                                        </Badge>
                                        <Badge
                                            variant='outline'
                                            className='text-xs px-2 py-0.5 h-5 border-cyan-400/50 text-cyan-600 bg-cyan-400/10'
                                        >
                                            {uploadedFile.type
                                                .split('/')[1]
                                                ?.toUpperCase() || 'FILE'}
                                        </Badge>
                                    </div>
                                </div>
                                <CheckCircle className='h-5 w-5 text-green-500' />
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={removeFile}
                                className='text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-all duration-200'
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card
                    {...getRootProps()}
                    className={cn(
                        'cursor-pointer transition-all duration-200 border border-gray-200/60 bg-white/95 backdrop-blur-sm hover:shadow-lg hover:border-cyan-400/50 hover:bg-cyan-50/20',
                        isDragActive &&
                            'border-cyan-400 bg-cyan-50/30 shadow-lg scale-[1.02]',
                        disabled && 'cursor-not-allowed opacity-50',
                        error && 'border-red-300 bg-red-50/30',
                    )}
                >
                    <CardContent className='flex flex-col items-center justify-center p-8 text-center'>
                        <input {...getInputProps()} />
                        <div className='mb-6'>
                            {error ? (
                                <div className='bg-gradient-to-br from-red-400 to-red-600 text-white flex aspect-square size-16 items-center justify-center rounded-xl shadow-lg mx-auto'>
                                    <AlertCircle className='h-8 w-8' />
                                </div>
                            ) : (
                                <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-16 items-center justify-center rounded-xl shadow-lg mx-auto hover:shadow-cyan-400/30 hover:shadow-xl hover:scale-105 transition-all duration-200'>
                                    <Upload className='h-8 w-8' />
                                </div>
                            )}
                        </div>
                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold text-gray-900'>
                                {error
                                    ? 'Upload Failed'
                                    : isDragActive
                                      ? 'Drop file here'
                                      : 'Upload Job Posting'}
                            </h3>
                            <p className='text-sm text-gray-600 max-w-md mx-auto leading-relaxed'>
                                {error ? (
                                    <span className='text-red-600 font-medium'>
                                        {error}
                                    </span>
                                ) : (
                                    <>
                                        Drag and drop your file here, or{' '}
                                        <span className='text-cyan-600 font-medium underline hover:text-cyan-700 transition-colors'>
                                            browse files
                                        </span>
                                    </>
                                )}
                            </p>
                            <div className='flex flex-wrap justify-center gap-2 mt-4'>
                                {Object.values(acceptedFileTypes)
                                    .flat()
                                    .map((ext) => {
                                        return (
                                            <Badge
                                                key={ext}
                                                variant='outline'
                                                className='text-xs px-2 py-1 border-gray-300/50 text-gray-600 bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200'
                                            >
                                                {ext}
                                            </Badge>
                                        );
                                    })}
                            </div>
                            <p className='text-xs text-gray-500 mt-2'>
                                Maximum file size:{' '}
                                <span className='font-medium'>
                                    {maxFileSize}MB
                                </span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
