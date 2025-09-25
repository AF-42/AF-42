import { redirect } from 'next/navigation';

export default function RedirectPage() {
	return (
		<>
			<div>Redirecting...</div>
			{redirect('/home')}
		</>
	);
}
