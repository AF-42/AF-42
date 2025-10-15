'use client';

import { useRef, useState, useTransition } from 'react';
import * as print from '@/lib/print-helpers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { type ChallengeType } from '@/types/challenge.type';
import {
    Edit3,
    Save,
    FileText,
    CheckCircle2,
    Target,
    Award,
    ClipboardList,
    BarChart3,
    ArrowLeft,
} from 'lucide-react';
import techUrls from '@/app/data-json/tech-logo-url.json';
import { updateChallengeDraftAction } from '@/app/actions/update-challenge-draft.action';

// Helper function to convert CDN URLs to GitHub direct URLs
const convertToGitHubUrl = (url: string): string => {
    if (url.includes('cdn.jsdelivr.net/gh/devicons/devicon')) {
        return url.replace(
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/',
            'https://github.com/devicons/devicon/raw/v2.17.0/icons/',
        );
    }
    return url;
};

// Helper function to get fallback icon URL
const getFallbackIconUrl = (): string => {
    const fallbackOptions = [
        'https://github.com/devicons/devicon/raw/v2.17.0/icons/code/code-original.svg',
        'https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/code/code-original.svg',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEwIDIyTDEzLjA5IDE1Ljc0TDIwIDE1TDEzLjA5IDguMjZMMTAgMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+',
    ];
    return fallbackOptions[0]; // Return the first option for now
};

// Helper function to safely get tech logo URL
const getTechLogoUrl = (techName: string): string => {
    const techData = techUrls.techUrls;

    // Normalize the tech name for better matching
    const normalizedName = techName.trim();

    // Search through all categories
    const categories = [
        techData.programming_languages,
        techData.frontend_frameworks,
        techData.backend_frameworks,
        techData.databases,
        techData.devops_tools,
        techData.css_frameworks,
        techData.testing_frameworks,
        techData.data_science,
        techData.mobile_development,
        techData.game_development,
        techData.cloud_platforms,
        techData.package_managers,
        techData.build_tools,
        techData.other_tools,
    ];

    for (const category of categories) {
        const tech = category[normalizedName as keyof typeof category];
        if (tech && typeof tech === 'object' && 'logo_url' in tech) {
            const logoUrl = (tech as { logo_url: string }).logo_url;
            if (logoUrl && logoUrl.startsWith('http')) {
                return convertToGitHubUrl(logoUrl);
            }
        }
    }

    // Log missing technology for debugging
    console.warn(`Technology "${techName}" not found in tech-logo-url.json`);

    // Fallback to a default icon or placeholder
    return getFallbackIconUrl();
};

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
    print.log('[ChallengeDraftEditor] Challenge draft:', challengeDraft);
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

    const [isCollapsed, setIsCollapsed] = useState<Record<string, boolean>>(
        Object.fromEntries(
            SECTION_HEADERS.map((header) => {
                return [header, false];
            }),
        ),
    );

    const textareaRefs = useRef<
        Record<string, HTMLTextAreaElement | undefined>
    >({});

    const [isPending, startTransition] = useTransition();
    const [saveMessage, setSaveMessage] = useState<string | undefined>(
        undefined,
    );

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

    const rebuildDescriptionFromSections = (
        sectionsMap: Record<string, string>,
    ) => {
        return SECTION_HEADERS.map((header) => {
            const body = sectionsMap[header] ?? '';
            return `${header}\n\n${body}\n\n`;
        })
            .join('')
            .trim();
    };

    const handleSaveAll = async () => {
        const newDescription = rebuildDescriptionFromSections(editedSections);
        startTransition(async () => {
            try {
                await updateChallengeDraftAction({
                    id: challengeDraft.id,
                    challenge_description: newDescription,
                });
                setSaveMessage('Draft saved');
                setTimeout(() => setSaveMessage(undefined), 2000);
            } catch (e) {
                setSaveMessage('Save failed');
                setTimeout(() => setSaveMessage(undefined), 3000);
            }
        });
    };

    const handleSaveSection = async (header: string) => {
        const updated = { ...editedSections };
        const newDescription = rebuildDescriptionFromSections(updated);
        startTransition(async () => {
            try {
                await updateChallengeDraftAction({
                    id: challengeDraft.id,
                    challenge_description: newDescription,
                });
                setIsEditing({ ...isEditing, [header]: false });
                setSaveMessage('Section saved');
                setTimeout(() => setSaveMessage(undefined), 2000);
            } catch (e) {
                setSaveMessage('Save failed');
                setTimeout(() => setSaveMessage(undefined), 3000);
            }
        });
    };

    return (
        <div className='flex flex-1 flex-col min-h-screen relative overflow-hidden'>
            {/* Content with relative positioning */}
            <div className='relative z-10 flex flex-1 flex-col min-h-screen overflow-hidden'>
                {/* Enhanced Main Content - Responsive Layout */}
                <div className='flex flex-1 flex-col overflow-hidden'>
                    <div className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8'>
                        <div className='max-w-7xl mx-auto'>
                            {/* Enhanced Back Button */}
                            <Link href='/challenge/all'>
                                <Button
                                    variant='ghost'
                                    className='mb-4 sm:mb-6 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-colors duration-200 w-full sm:w-auto'
                                >
                                    <ArrowLeft className='w-4 h-4 mr-2' />
                                    Back to Challenges
                                </Button>
                            </Link>

                            {/* Full Width Challenge Header */}
                            <div className='bg-white rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200 mb-4 sm:mb-6 lg:mb-8'>
                                <div className='p-4 sm:p-6 lg:p-8'>
                                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                                        {/* Left side - Title and badges */}
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex flex-wrap items-center gap-3'>
                                                <Badge className='bg-cyan-100 text-cyan-800 border border-cyan-400/50 text-sm'>
                                                    <Edit3 className='w-4 h-4 mr-1' />
                                                    Edit Mode
                                                </Badge>
                                                <Badge className='bg-gray-100 text-gray-800 border border-gray-400/50 text-sm'>
                                                    <Target className='w-4 h-4 mr-1' />
                                                    {challengeDraft.challenge_difficulty ||
                                                        'Not specified'}
                                                </Badge>
                                            </div>

                                            <div className='space-y-3'>
                                                <h1 className='text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight'>
                                                    Edit Challenge:{' '}
                                                    {challengeDraft.challenge_name ||
                                                        'Untitled Challenge'}
                                                </h1>
                                                <div className='h-1 w-20 sm:w-24 bg-cyan-600 rounded-sm'></div>
                                            </div>
                                        </div>

                                        {/* Right side - Stats and Action */}
                                        <div className='flex flex-col gap-4 lg:items-end'>
                                            <div className='flex flex-wrap gap-3'>
                                                <div className='flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-md border border-slate-200'>
                                                    <CheckCircle2 className='w-4 h-4 text-slate-600 flex-shrink-0' />
                                                    <span className='text-slate-700'>
                                                        Tech Stack:{' '}
                                                        <span className='font-semibold text-slate-700'>
                                                            {challengeDraft
                                                                .challenge_requirements
                                                                ?.length ||
                                                                0}{' '}
                                                            technologies
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
                                                <Button
                                                    className='bg-cyan-600 hover:bg-cyan-700 text-white transition-colors duration-200 flex-1 sm:flex-none disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed'
                                                    size='sm'
                                                    onClick={handleSaveAll}
                                                    disabled={isPending}
                                                >
                                                    <Save className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                                                    <span className='hidden sm:inline'>
                                                        Save Draft
                                                    </span>
                                                    <span className='sm:hidden'>
                                                        Save
                                                    </span>
                                                </Button>
                                                {saveMessage && (
                                                    <span className='text-sm text-slate-600 self-center'>
                                                        {saveMessage}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Challenge Sections */}
                            <div className='space-y-4 sm:space-y-6'>
                                {SECTION_HEADERS.map((header) => {
                                    const IconComponent =
                                        SECTION_ICONS[
                                            header as keyof typeof SECTION_ICONS
                                        ];

                                    // Get color scheme based on section type
                                    const getSectionColor = (
                                        header: string,
                                    ) => {
                                        switch (header) {
                                            case '## 1. Problem Overview:':
                                                return {
                                                    bg: 'bg-blue-500',
                                                    accent: 'bg-blue-600',
                                                    hover: 'hover:border-blue-200',
                                                    icon: IconComponent,
                                                };
                                            case '## 2. Problem Statement:':
                                                return {
                                                    bg: 'bg-cyan-500',
                                                    accent: 'bg-cyan-600',
                                                    hover: 'hover:border-cyan-200',
                                                    icon: IconComponent,
                                                };
                                            case '## 3. Requirements:':
                                                return {
                                                    bg: 'bg-emerald-500',
                                                    accent: 'bg-emerald-600',
                                                    hover: 'hover:border-emerald-200',
                                                    icon: IconComponent,
                                                };
                                            case '## 4. Optional Requirements:':
                                                return {
                                                    bg: 'bg-purple-500',
                                                    accent: 'bg-purple-600',
                                                    hover: 'hover:border-purple-200',
                                                    icon: IconComponent,
                                                };
                                            case '## 5. Deliverables:':
                                                return {
                                                    bg: 'bg-purple-500',
                                                    accent: 'bg-purple-600',
                                                    hover: 'hover:border-purple-200',
                                                    icon: IconComponent,
                                                };
                                            case '## 6. Evaluation Rubric:':
                                                return {
                                                    bg: 'bg-amber-500',
                                                    accent: 'bg-amber-600',
                                                    hover: 'hover:border-amber-200',
                                                    icon: IconComponent,
                                                };
                                            default:
                                                return {
                                                    bg: 'bg-gray-500',
                                                    accent: 'bg-gray-600',
                                                    hover: 'hover:border-gray-200',
                                                    icon: IconComponent,
                                                };
                                        }
                                    };

                                    const colors = getSectionColor(header);

                                    return (
                                        <div
                                            key={header}
                                            className={`bg-white rounded-lg border border-gray-200 ${colors.hover} transition-colors duration-200`}
                                        >
                                            <div className='p-4 sm:p-6'>
                                                <div className='mb-6'>
                                                    <div className='flex items-center gap-3 mb-3'>
                                                        <div
                                                            className={`p-2 ${colors.bg} rounded-md`}
                                                        >
                                                            <colors.icon className='w-5 h-5 text-white' />
                                                        </div>
                                                        <h2 className='text-xl font-bold text-slate-900'>
                                                            {headerToTitle(
                                                                header,
                                                            )}
                                                        </h2>
                                                    </div>
                                                    <div
                                                        className={`h-0.5 w-16 ${colors.accent} rounded-sm`}
                                                    ></div>
                                                </div>

                                                <div className='mb-6'>
                                                    {isEditing[header] ? (
                                                        <Textarea
                                                            ref={
                                                                setTextareaRef(
                                                                    header,
                                                                ) as React.Ref<HTMLTextAreaElement>
                                                            }
                                                            value={
                                                                editedSections[
                                                                    header
                                                                ]
                                                            }
                                                            onChange={handleChange(
                                                                header,
                                                            )}
                                                            className='resize-none overflow-hidden min-h-[120px] border-gray-200 focus:border-cyan-400 focus:ring-cyan-400/20'
                                                            placeholder={`Enter content for ${headerToTitle(header)}...`}
                                                        />
                                                    ) : (
                                                        <div className='max-h-40 overflow-hidden'>
                                                            <ScrollArea className='h-40'>
                                                                <div className='prose prose-slate max-w-none pr-4'>
                                                                    <div className='text-slate-700 leading-relaxed text-base whitespace-pre-line'>
                                                                        {editedSections[
                                                                            header
                                                                        ] || (
                                                                            <span className='text-gray-400 italic'>
                                                                                No
                                                                                content
                                                                                available
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </ScrollArea>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='flex justify-end'>
                                                    <Button
                                                        variant={
                                                            isEditing[header]
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() => {
                                                            if (
                                                                isEditing[
                                                                    header
                                                                ]
                                                            ) {
                                                                void handleSaveSection(
                                                                    header,
                                                                );
                                                            }
                                                            setIsEditing({
                                                                ...isEditing,
                                                                [header]:
                                                                    !isEditing[
                                                                        header
                                                                    ],
                                                            });
                                                        }}
                                                        className={
                                                            isEditing[header]
                                                                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                                                : 'hover:border-cyan-400 hover:text-cyan-600'
                                                        }
                                                        size='sm'
                                                        disabled={isPending}
                                                    >
                                                        {isEditing[header] ? (
                                                            <>
                                                                <Save className='w-4 h-4 mr-2' />
                                                                Save Changes
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Edit3 className='w-4 h-4 mr-2' />
                                                                Edit Section
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
