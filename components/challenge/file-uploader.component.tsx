'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle, type File, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

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
                <Card className='bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200/60 hover:shadow-xl transition-all duration-300'>
                    <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-4'>
                                <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-12 items-center justify-center rounded-xl shadow-lg'>
                                    <span className='text-xl'>
                                        {getFileIcon(uploadedFile)}
                                    </span>
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-base font-semibold text-gray-900 truncate'>
                                        {uploadedFile.name}
                                    </p>
                                    <div className='flex items-center gap-3 mt-2'>
                                        <Badge className='bg-gray-100 text-gray-700 border-gray-200 text-sm px-3 py-1'>
                                            {formatFileSize(uploadedFile.size)}
                                        </Badge>
                                        <Badge className='bg-blue-100 text-blue-700 border-blue-200 text-sm px-3 py-1'>
                                            {uploadedFile.type
                                                .split('/')[1]
                                                ?.toUpperCase() || 'FILE'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <CheckCircle className='h-6 w-6 text-green-500' />
                                    <span className='text-sm font-medium text-green-600'>
                                        Uploaded
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={removeFile}
                                className='text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg'
                            >
                                <X className='h-5 w-5' />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card
                    {...getRootProps()}
                    className={cn(
                        'cursor-pointer transition-all duration-300 border border-gray-200/60 bg-white/90 backdrop-blur-sm hover:shadow-xl hover:border-blue-400/50 hover:bg-blue-50/20 rounded-xl',
                        isDragActive &&
                            'border-blue-400 bg-blue-50/30 shadow-xl scale-[1.02]',
                        disabled && 'cursor-not-allowed opacity-50',
                        error && 'border-red-300 bg-red-50/30',
                    )}
                >
                    <CardContent className='p-8'>
                        <input {...getInputProps()} />
                        <div className='flex flex-col items-center text-center space-y-6'>
                            <div className='relative'>
                                {error ? (
                                    <div className='bg-gradient-to-br from-red-400 to-red-600 text-white flex aspect-square size-16 items-center justify-center rounded-2xl shadow-xl'>
                                        <AlertCircle className='h-8 w-8' />
                                    </div>
                                ) : (
                                    <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 text-white flex aspect-square size-16 items-center justify-center rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300'>
                                        <HoverCard
                                            openDelay={100}
                                            closeDelay={100}
                                        >
                                            <HoverCardTrigger className='cursor-pointer'>
                                                <Upload className='h-8 w-8' />
                                            </HoverCardTrigger>
                                            <HoverCardContent
                                                side='right'
                                                sideOffset={20}
                                                className='bg-white shadow-lg border border-cyan-200 w-48 h-12 flex items-center justify-center'
                                            >
                                                <p className='text-cyan-600 text-sm font-semibold'>
                                                    Click here to upload a file
                                                </p>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                )}
                                {!error && !isDragActive && (
                                    <div className='absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex aspect-square size-6 items-center justify-center rounded-full shadow-lg'>
                                        <span className='text-xs font-bold'>
                                            +
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className='space-y-3'>
                                <h3 className='text-2xl font-bold text-gray-900'>
                                    {error
                                        ? 'Upload Failed'
                                        : isDragActive
                                          ? 'Drop file here'
                                          : 'Upload Job Posting'}
                                </h3>
                                <p className='text-lg text-gray-600 leading-relaxed max-w-md'>
                                    {error ? (
                                        <span className='text-red-600 font-medium'>
                                            {error}
                                        </span>
                                    ) : (
                                        <>
                                            Drag and drop your file here, or{' '}
                                            <span className='text-blue-600 font-semibold underline hover:text-blue-700 transition-colors cursor-pointer'>
                                                browse files
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className='flex flex-wrap justify-center gap-2 mt-6'>
                                {Object.values(acceptedFileTypes)
                                    .flat()
                                    .map((ext) => {
                                        return (
                                            <Badge
                                                key={ext}
                                                className='text-sm px-3 py-1 bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-all duration-200 rounded-lg'
                                            >
                                                {ext}
                                            </Badge>
                                        );
                                    })}
                            </div>

                            <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span>
                                        Maximum file size:{' '}
                                        <span className='font-semibold text-gray-700'>
                                            {maxFileSize}MB
                                        </span>
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <span>Secure upload</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
