import { Upload, Sparkles, CodeXml, Zap } from 'lucide-react';
import { TaskGeneratorFormFromFileUpload } from '@/components/challenge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ChallengeGeneratorSelectorComponent() {
    return (
        <div className='w-full max-w-6xl mx-auto space-y-6 sm:space-y-8'>
            {/* Header Section */}
            <div className='text-center space-y-4 sm:space-y-6'>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
                    <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-lg'>
                        <Sparkles className='size-5 sm:size-6' />
                    </div>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 font-source-code-pro'>
                        Challenge Generator
                    </h1>
                </div>
                <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0'>
                    Transform job postings into comprehensive technical
                    challenges with our AI-powered platform
                </p>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6'>
                    <Badge
                        variant='outline'
                        className='text-sm px-3 py-1 border-cyan-400/50 text-cyan-600 bg-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400/70 transition-all duration-200'
                    >
                        <Zap className='size-3 mr-1' />
                        AI-Powered
                    </Badge>
                    <Badge
                        variant='outline'
                        className='text-sm px-3 py-1 border-gray-300/50 text-gray-600 bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200'
                    >
                        <CodeXml className='size-3 mr-1' />
                        Automated
                    </Badge>
                </div>
            </div>

            {/* Main Generator Card */}
            <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'>
                <CardHeader className='border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/95 backdrop-blur-sm p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                        <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-md flex-shrink-0'>
                            <Upload className='size-5' />
                        </div>
                        <div className='flex-1'>
                            <CardTitle className='text-lg sm:text-xl font-semibold text-gray-900'>
                                Upload Job Posting
                            </CardTitle>
                            <CardDescription className='text-sm sm:text-base text-gray-600 mt-1'>
                                Upload a job posting file and let our AI extract
                                technical requirements automatically
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-4 sm:p-6'>
                    <TaskGeneratorFormFromFileUpload />
                </CardContent>
            </Card>

            {/* Features Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8'>
                <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-200'>
                    <CardContent className='p-4 sm:p-6 text-center'>
                        <div className='bg-gradient-to-br from-blue-400 to-blue-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-md mx-auto mb-3 sm:mb-4'>
                            <Upload className='size-5 sm:size-6' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                            Multiple Formats
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600'>
                            Supports PDF, DOCX, TXT, and XLSX files
                        </p>
                    </CardContent>
                </Card>

                <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-200'>
                    <CardContent className='p-4 sm:p-6 text-center'>
                        <div className='bg-gradient-to-br from-green-400 to-green-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-md mx-auto mb-3 sm:mb-4'>
                            <Sparkles className='size-5 sm:size-6' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                            AI Analysis
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600'>
                            Automatically extracts tech stack and requirements
                        </p>
                    </CardContent>
                </Card>

                <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-200'>
                    <CardContent className='p-4 sm:p-6 text-center'>
                        <div className='bg-gradient-to-br from-purple-400 to-purple-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-md mx-auto mb-3 sm:mb-4'>
                            <CodeXml className='size-5 sm:size-6' />
                        </div>
                        <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>
                            Instant Results
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600'>
                            Generate comprehensive challenges in seconds
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
