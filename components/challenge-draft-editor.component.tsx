export function ChallengeDraftEditor({ challengeDraft }: { challengeDraft: string }) {
	return (
		<>
			<div className="prose dark:prose-invert">{challengeDraft}</div>
		</>
	);
}
