export default async function DraftPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <div>DraftPage {id}</div>;
}
