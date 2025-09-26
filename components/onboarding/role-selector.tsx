'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleSelectorProps {
	userKindeId: string;
}

export function RoleSelector({ userKindeId }: RoleSelectorProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleRoleChange = async (value: string) => {
		setIsLoading(true);

		try {
			const response = await fetch('/api/users/update-role', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ role: value }),
			});

			if (!response.ok) {
				throw new Error('Failed to update role');
			}

			// Redirect to dashboard after successful role update
			router.push('/dashboard');
		} catch (error) {
			console.error('Error updating role:', error);
			// You might want to show a toast notification here
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Select onValueChange={handleRoleChange} disabled={isLoading}>
			<SelectTrigger>
				<SelectValue placeholder={isLoading ? 'Updating...' : 'Select a role'} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="engineer">I am an Engineer</SelectItem>
				<SelectItem value="company_admin">I am a Company Admin</SelectItem>
			</SelectContent>
		</Select>
	);
}
