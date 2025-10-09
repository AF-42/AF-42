'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    AlertCircle, CheckCircle, type File, Upload, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FileUploaderProps = {
    onFileSelect       : (file: File | undefined) => void;
    acceptedFileTypes?: Record<string, string[]>;
    maxFileSize?       : number; // In MB
    className?         : string;
    disabled?          : boolean;
};

const DEFAULT_ACCEPTED_TYPES = {
    'application/pdf'                                                           : ['.pdf'],
    'application/msword'                                                        : ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   : ['.docx'],
    'text/plain'                                                                : ['.txt'],
    'text/markdown'                                                             : ['.md'],
    'application/json'                                                          : ['.json'],
    'application/vnd.ms-excel'                                                  : ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         : ['.xlsx'],
    'application/vnd.ms-powerpoint'                                             : ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' : ['.pptx'],
    'image/jpeg'                                                                : ['.jpg', '.jpeg']
};

export const FileUploaderComponent = ({
    onFileSelect,
    acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
    maxFileSize = 10, // 10MB default
    className,
    disabled = false
}: FileUploaderProps) => {
    const [uploadedFile, setUploadedFile] = useState<File | undefined>(null);
    const [error, setError] = useState<string | undefined>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError(null);

            if (rejectedFiles.length > 0) {
                const rejection = rejectedFiles[0];
                if (rejection.errors[0]?.code === 'file-too-large') {
                    setError(`File size must be less than ${maxFileSize}MB`);
                }
                else if (rejection.errors[0]?.code === 'file-invalid-type') {
                    setError('File type not supported');
                }
                else {
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
        [onFileSelect, maxFileSize]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept   : acceptedFileTypes as any,
        maxSize  : maxFileSize * 1024 * 1024, // Convert MB to bytes
        multiple : false,
        disabled
    });

    const removeFile = () => {
        setUploadedFile(null);
        setError(null);
        onFileSelect(null);
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
            {uploadedFile
                ? (
                    <Card className="border-none">
                        <CardContent className="p-4 border-none">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl">{getFileIcon(uploadedFile)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                                    </div>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={removeFile}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
                : (
                    <Card
                        {...getRootProps()}
                        className={cn(
                            'cursor-pointer transition-colors hover:bg-muted/50 border-none',
                            isDragActive && 'bg-muted/50 border-primary',
                            disabled && 'cursor-not-allowed opacity-50',
                            error && 'border-destructive'
                        )}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center border-none">
                            <input {...getInputProps()} />
                            <div className="mb-4">
                                {error
                                    ? (
                                        <AlertCircle className="h-12 w-12 text-destructive" />
                                    )
                                    : (
                                        <Upload className="h-12 w-12 text-muted-foreground" />
                                    )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    {error ? 'Upload Failed' : (isDragActive ? 'Drop file here' : 'Upload Job Offer')}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {error
                                        ? (
                                            <span className="text-destructive">{error}</span>
                                        )
                                        : (
                                            <>
                                                Drag and drop your file here, or{' '}
                                                <span className="text-primary underline">browse</span>
                                            </>
                                        )}
                                </p>
                                <div className="flex flex-wrap justify-center gap-1 mt-3">
                                    {Object.values(acceptedFileTypes)
                                        .flat()
                                        .map((ext) => {
                                            return (
                                                <Badge key={ext} variant="secondary" className="text-xs">
                                                    {ext}
                                                </Badge>
                                            );
                                        })}
                                </div>
                                <p className="text-xs text-muted-foreground">Max file size: {maxFileSize}MB</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
        </div>
    );
};
