'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompanyMember {
	member: {
		id: string;
		company_id: string;
		user_id: string;
		is_admin: boolean;
		created_at: Date;
		updated_at: Date;
	};
	user: {
		id: string;
		kinde_id: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		role: string;
		created_at: Date;
		last_login: Date;
	};
}

interface ApiResponse {
	success: boolean;
	members: CompanyMember[];
	company: {
		id: string;
		name: string;
		email: string;
		industry: string;
		description: string;
	};
}

export default function MembersPage() {
	const [members, setMembers] = useState<CompanyMember[]>([]);
	const [company, setCompany] = useState<ApiResponse['company'] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const response = await fetch('/api/companies/members');
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch members');
				}

				if (data.success) {
					setMembers(data.members);
					setCompany(data.company);
				} else {
					throw new Error('Failed to fetch members');
				}
			} catch (err) {
				console.error('Error fetching members:', err);
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchMembers();
	}, []);

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-96 mt-2" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="flex items-center space-x-4">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Company Members</h1>
					<p className="text-muted-foreground">Manage your team members</p>
				</div>
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Company Members</h1>
				<p className="text-muted-foreground">Manage your team members for {company?.name}</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Team Members ({members.length})</CardTitle>
					<CardDescription>All members associated with your company</CardDescription>
				</CardHeader>
				<CardContent>
					{members.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">No members found</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Member</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Joined</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{members.map((member) => (
									<TableRow key={member.member.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Avatar>
													<AvatarImage src="" />
													<AvatarFallback>
														{member.user.first_name[0]}
														{member.user.last_name[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">
														{member.user.first_name} {member.user.last_name}
													</div>
													<div className="text-sm text-muted-foreground">
														@{member.user.username}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>{member.user.email}</TableCell>
										<TableCell>
											<Badge variant={member.user.role ? 'default' : 'secondary'}>
												{member.user.role || 'No role assigned'}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={member.member.is_admin ? 'default' : 'outline'}>
												{member.member.is_admin ? 'Admin' : 'Member'}
											</Badge>
										</TableCell>
										<TableCell>{new Date(member.member.created_at).toLocaleDateString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
