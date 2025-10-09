export default function DraftPage({ params }: { params: { id: string } }) {
	const { id } = params;
	return <div>DraftPage {id}</div>;
}
