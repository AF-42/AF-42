'use client';

import { Card, CardContent } from '@/components/ui/card';

interface UserRoleSelectorProps {
	isNewUser: boolean;
}

export function UserRoleSelector({ isNewUser }: UserRoleSelectorProps) {
	return (
		<Card>
			<CardContent>
				<h1>User Role Selector</h1>
			</CardContent>
		</Card>
	);
}
