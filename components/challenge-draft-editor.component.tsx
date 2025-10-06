'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';

const SECTION_HEADERS = [
	'## 1. Problem Overview:',
	'## 2. Problem Statement:',
	'## 3. Requirements:',
	'## 4. Optional Requirements:',
	'## 5. Deliverables:',
	'## 6. Evaluation Rubric:',
];

function extractSections(draft: string, headers: string[]) {
	const result: Record<string, string> = {};

	// Find positions of each header in the draft
	const positions = headers
		.map((header) => ({ header, index: draft.indexOf(header) }))
		.filter(({ index }) => index !== -1)
		.sort((a, b) => a.index - b.index);

	const stripTrailingCodeFence = (text: string) => text.replace(/```\s*$/m, '').trimEnd();

	for (let i = 0; i < positions.length; i++) {
		const { header, index } = positions[i];
		const nextIndex = i + 1 < positions.length ? positions[i + 1].index : draft.length;
		const start = index + header.length;
		let content = draft.slice(start, nextIndex).trim();

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

export function ChallengeDraftEditor({ challengeDraft }: { challengeDraft: string }) {
	const sections = extractSections(challengeDraft, SECTION_HEADERS);
	const [editedSections, setEditedSections] = useState<Record<string, string>>(sections);
	const [isEditing, setIsEditing] = useState<Record<string, boolean>>(
		Object.fromEntries(SECTION_HEADERS.map((header) => [header, false])),
	);

	const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

	const setTextareaRef = (header: string) => (el: HTMLTextAreaElement | null) => {
		textareaRefs.current[header] = el;
		if (el) {
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`;
		}
	};

	const handleChange = (header: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedSections({ ...editedSections, [header]: e.target.value });
		// Auto-resize as the user types
		e.target.style.height = 'auto';
		e.target.style.height = `${e.target.scrollHeight}px`;
	};
	return (
		<>
			{SECTION_HEADERS.map((header) => (
				<div key={header} className="w-full mb-4">
					<Card className="w-full border-none shadow-sm mb-4">
						<CardHeader>
							<CardTitle>{headerToTitle(header)}</CardTitle>
						</CardHeader>
						<CardContent>
							<ScrollArea>
								{isEditing[header] ? (
									<Textarea
										ref={setTextareaRef(header)}
										value={editedSections[header]}
										onChange={handleChange(header)}
										className="resize-none overflow-hidden"
									/>
								) : (
									<div>{editedSections[header] ?? ''}</div>
								)}
							</ScrollArea>
						</CardContent>
						<CardFooter className="border-none flex gap-2 justify-end">
							<Button
								variant="outline"
								onClick={() => setIsEditing({ ...isEditing, [header]: !isEditing[header] })}
							>
								{isEditing[header] ? 'Save' : 'Edit'}
							</Button>
						</CardFooter>
					</Card>
				</div>
			))}
		</>
	);
}
