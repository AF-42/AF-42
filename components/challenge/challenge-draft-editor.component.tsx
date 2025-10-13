'use client';

import { useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { type ChallengeType } from '@/types/challenge.type';
import {
    Edit3,
    Save,
    Users,
    Globe,
    FileText,
    CheckCircle2,
    Target,
    Award,
    ClipboardList,
    BarChart3,
    Sparkles,
    ArrowLeft,
} from 'lucide-react';

const SECTION_HEADERS = [
    '## 1. Problem Overview:',
    '## 2. Problem Statement:',
    '## 3. Requirements:',
    '## 4. Optional Requirements:',
    '## 5. Deliverables:',
    '## 6. Evaluation Rubric:',
];

const SECTION_ICONS = {
    '## 1. Problem Overview:': Target,
    '## 2. Problem Statement:': FileText,
    '## 3. Requirements:': CheckCircle2,
    '## 4. Optional Requirements:': Award,
    '## 5. Deliverables:': ClipboardList,
    '## 6. Evaluation Rubric:': BarChart3,
};

function extractSections(draft: ChallengeType, headers: string[]) {
    const result: Record<string, string> = {};

    // Find positions of each header in the draft
    const positions = headers
        .map((header) => {
            return {
                header,
                index: draft.challenge_description.indexOf(header),
            };
        })
        .filter(({ index }) => {
            return index !== -1;
        })
        .sort((a, b) => {
            return a.index - b.index;
        });

    const stripTrailingCodeFence = (text: string) => {
        return text.replace(/```\s*$/m, '').trimEnd();
    };

    for (let i = 0; i < positions.length; i++) {
        const { header, index } = positions[i];
        const nextIndex =
            i + 1 < positions.length
                ? positions[i + 1].index
                : draft.challenge_description.length;
        const start = index + header.length;
        let content = draft.challenge_description
            .slice(start, nextIndex)
            .trim();

        // For the last section in the draft, remove a trailing code fence if present
        if (i === positions.length - 1) {
            content = stripTrailingCodeFence(content);
        }
        result[header] = content;
    }

    return result;
}

function headerToTitle(header: string) {
    // Convert "## 1. Problem Overview:" => "1. Problem Overview"
    return header.replace(/^##\s*/, '').replace(/:\s*$/, '');
}

export function ChallengeDraftEditor({
    challengeDraft,
}: {
    challengeDraft: ChallengeType;
}) {
    const sections = extractSections(challengeDraft, SECTION_HEADERS);
    const [editedSections, setEditedSections] =
        useState<Record<string, string>>(sections);
    const [isEditing, setIsEditing] = useState<Record<string, boolean>>(
        Object.fromEntries(
            SECTION_HEADERS.map((header) => {
                return [header, false];
            }),
        ),
    );

    const textareaRefs = useRef<
        Record<string, HTMLTextAreaElement | undefined>
    >({});

    const setTextareaRef = (header: string) => {
        return (element: HTMLTextAreaElement | undefined) => {
            textareaRefs.current[header] = element;
            if (element) {
                element.style.height = 'auto';
                element.style.height = `${element.scrollHeight}px`;
            }
        };
    };

    const handleChange = (header: string) => {
        return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setEditedSections({
                ...editedSections,
                [header]: e.target.value,
            });
            // Auto-resize as the user types
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
        };
    };

    return (
        <div className='w-full max-w-6xl mx-auto space-y-6 sm:space-y-8'>
            {/* Header Section */}
            <div className='text-center space-y-4 sm:space-y-6'>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
                    <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-10 sm:size-12 items-center justify-center rounded-xl shadow-lg'>
                        <Edit3 className='size-5 sm:size-6' />
                    </div>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 font-source-code-pro'>
                        Edit Challenge
                    </h1>
                </div>
                <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0'>
                    Refine and customize your technical challenge before
                    publishing
                </p>
            </div>

            {/* Challenge Overview Card */}
            <Card className='border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-lg'>
                <CardHeader className='border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/95 backdrop-blur-sm p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
                        <div className='bg-gradient-to-br from-blue-400 to-blue-600 text-white flex aspect-square size-10 items-center justify-center rounded-lg shadow-md flex-shrink-0'>
                            <Sparkles className='size-5' />
                        </div>
                        <div className='flex-1'>
                            <CardTitle className='text-lg sm:text-xl font-semibold text-gray-900'>
                                Challenge Overview
                            </CardTitle>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                <Badge
                                    variant='outline'
                                    className='text-sm px-3 py-1 border-cyan-400/50 text-cyan-600 bg-cyan-400/10'
                                >
                                    <Target className='size-3 mr-1' />
                                    {challengeDraft.challenge_name ||
                                        'Not specified'}
                                </Badge>
                                <Badge
                                    variant='outline'
                                    className='text-sm px-3 py-1 border-gray-300/50 text-gray-600 bg-gray-50/80'
                                >
                                    <Award className='size-3 mr-1' />
                                    {challengeDraft.challenge_difficulty ||
                                        'Not specified'}
                                </Badge>
                                <Badge
                                    variant='outline'
                                    className='text-sm px-3 py-1 border-green-400/50 text-green-600 bg-green-400/10'
                                >
                                    <CheckCircle2 className='size-3 mr-1' />
                                    {challengeDraft.challenge_requirements
                                        ?.length || 0}{' '}
                                    technologies
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                        <Button
                            variant='outline'
                            className='flex-1 sm:flex-none justify-center sm:justify-start'
                        >
                            <Users className='size-4 mr-2' />
                            Invite Team Review
                        </Button>
                        <Button
                            variant='outline'
                            className='flex-1 sm:flex-none justify-center sm:justify-start'
                        >
                            <Globe className='size-4 mr-2' />
                            Publish Challenge
                        </Button>
                        <Button className='flex-1 sm:flex-none justify-center sm:justify-start bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'>
                            <Save className='size-4 mr-2' />
                            Save Draft
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Challenge Sections */}
            <div className='space-y-4 sm:space-y-6'>
                {SECTION_HEADERS.map((header) => {
                    const IconComponent =
                        SECTION_ICONS[header as keyof typeof SECTION_ICONS];
                    return (
                        <Card
                            key={header}
                            className='border border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                            <CardHeader className='border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/95 backdrop-blur-sm p-4 sm:p-6'>
                                <div className='flex items-center gap-3 sm:gap-4'>
                                    <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-white flex aspect-square size-8 sm:size-10 items-center justify-center rounded-lg shadow-md flex-shrink-0'>
                                        <IconComponent className='size-4 sm:size-5' />
                                    </div>
                                    <CardTitle className='text-lg sm:text-xl font-semibold text-gray-900'>
                                        {headerToTitle(header)}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className='p-4 sm:p-6'>
                                <ScrollArea className='max-h-96'>
                                    {isEditing[header] ? (
                                        <Textarea
                                            ref={
                                                setTextareaRef(
                                                    header,
                                                ) as React.Ref<HTMLTextAreaElement>
                                            }
                                            value={editedSections[header]}
                                            onChange={handleChange(header)}
                                            className='resize-none overflow-hidden min-h-[120px] border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20'
                                            placeholder={`Enter content for ${headerToTitle(header)}...`}
                                        />
                                    ) : (
                                        <div className='prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap'>
                                            {editedSections[header] || (
                                                <span className='text-gray-400 italic'>
                                                    No content available
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className='border-t border-gray-200/60 bg-gray-50/50 p-4 sm:p-6'>
                                <div className='flex justify-end w-full'>
                                    <Button
                                        variant={
                                            isEditing[header]
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => {
                                            setIsEditing({
                                                ...isEditing,
                                                [header]: !isEditing[header],
                                            });
                                        }}
                                        className={
                                            isEditing[header]
                                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
                                                : 'hover:border-cyan-400 hover:text-cyan-600'
                                        }
                                    >
                                        {isEditing[header] ? (
                                            <>
                                                <Save className='size-4 mr-2' />
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 className='size-4 mr-2' />
                                                Edit Section
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Back Navigation */}
            <div className='flex justify-center pt-6'>
                <Link href='/challenge/all'>
                    <Button
                        variant='ghost'
                        className='text-gray-600 hover:text-gray-900'
                    >
                        <ArrowLeft className='size-4 mr-2' />
                        Back to Challenge List
                    </Button>
                </Link>
            </div>
        </div>
    );
}
