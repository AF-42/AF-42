import { Upload } from 'lucide-react';
import { TaskGeneratorFormFromFileUpload } from '@/components/challenge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function ChallengeGeneratorSelectorComponent() {
    return (
        <div className='w-full max-w-7xl mx-auto space-y-6'>
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Challenge Generator
                </h1>
                <p className='text-muted-foreground'>
                    Choose how you'd like to generate your technical challenge
                </p>
            </div>

            <Card className='border-none'>
                <CardHeader className='border-none'>
                    <CardTitle className='flex items-center gap-2'>
                        <Upload className='h-5 w-5' />
                        Upload Job Posting
                    </CardTitle>
                    <CardDescription>
                        Upload a job posting file (PDF, DOCX, TXT) and let our
                        AI extract the technical requirements automatically.
                        Perfect for when you have a complete job posting
                        document.
                    </CardDescription>
                </CardHeader>
                <CardContent className='border-none p-0'>
                    <TaskGeneratorFormFromFileUpload />
                </CardContent>
            </Card>
        </div>
    );
}
