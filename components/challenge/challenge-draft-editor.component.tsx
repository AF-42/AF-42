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
import { type ChallengeType } from '@/types/challenge.type';

const SECTION_HEADERS = [
    '## 1. Problem Overview:',
    '## 2. Problem Statement:',
    '## 3. Requirements:',
    '## 4. Optional Requirements:',
    '## 5. Deliverables:',
    '## 6. Evaluation Rubric:',
];

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
        <>
            <div>
                <div className='p-3 bg-background rounded-md'>
                    <h4 className='font-medium text-sm mb-2'>
                        Challenge Details:
                    </h4>
                    <div className='text-xs text-muted-foreground space-y-1'>
                        <div>
                            Role:{' '}
                            {challengeDraft.challenge_name || 'Not specified'}
                        </div>
                        <div>
                            Seniority:{' '}
                            {challengeDraft.challenge_difficulty ||
                                'Not specified'}
                        </div>
                        <div>
                            Technologies:{' '}
                            {challengeDraft.challenge_requirements?.length || 0}{' '}
                            identified
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 justify-end mt-4'>
                    <Button variant='outline' onClick={() => {}}>
                        Invite a tech member of your team to review the
                        challenge
                    </Button>
                    <Button variant='outline' onClick={() => {}}>
                        Publish Challenge
                    </Button>
                    <Button variant='outline' onClick={() => {}}>
                        Save Draft
                    </Button>
                </div>
            </div>

            {SECTION_HEADERS.map((header) => {
                return (
                    <div key={header} className='w-full mb-4'>
                        <Card className='w-full border-none shadow-sm mb-4'>
                            <CardHeader>
                                <CardTitle>{headerToTitle(header)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea>
                                    {isEditing[header] ? (
                                        <Textarea
                                            ref={
                                                setTextareaRef(
                                                    header,
                                                ) as React.Ref<HTMLTextAreaElement>
                                            }
                                            value={editedSections[header]}
                                            onChange={handleChange(header)}
                                            className='resize-none overflow-hidden'
                                        />
                                    ) : (
                                        <div>
                                            {editedSections[header] ?? ''}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className='border-none flex gap-2 justify-end'>
                                <Button
                                    variant='outline'
                                    onClick={() => {
                                        setIsEditing({
                                            ...isEditing,
                                            [header]: !isEditing[header],
                                        });
                                    }}
                                >
                                    {isEditing[header] ? 'Save' : 'Edit'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                );
            })}
        </>
    );
}
