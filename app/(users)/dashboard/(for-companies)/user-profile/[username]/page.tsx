'use client';

import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Building2, Mail, MapPin, Globe, Briefcase, ExternalLink } from 'lucide-react';
import { useParams } from 'next/navigation';
import * as print from '@/lib/print-helpers';

// User profile data type
interface UserProfile {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	role: string;
	bio: string;
	location: string;
	website: string;
	phone: string;
	avatar: string;
	banner: string;
}

export default function UserProfilePage() {
	const { user, isAuthenticated, isLoading: authLoading } = useKindeBrowserClient();
	const params = useParams();
	print.log('[params]', params);
	const username = params.username as string;
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Wait for authentication to load
	useEffect(() => {
		if (authLoading) {
			print.message('Authentication is still loading...');
			return;
		}

		if (!isAuthenticated) {
			print.message('User is not authenticated, redirecting to home');
			router.push('/home');
			return;
		}

		print.message('User is authenticated, proceeding with data fetch');
	}, [authLoading, isAuthenticated, router]);

	// Fetch user data on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			// Wait for auth to finish loading
			if (authLoading) {
				return;
			}

			if (!isAuthenticated || !user?.id) {
				print.message('Not authenticated or no user ID, skipping data fetch');
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch(`/api/users/profile/${username}`);

				if (!response.ok) {
					if (response.status === 404) {
						// User not found - redirect to create/edit page
						router.push(`/dashboard/user-profile/edit/${username}`);
						return;
					}
					throw new Error('Failed to fetch user data');
				}

				const result = await response.json();
				if (result.success && result.user) {
					const userProfile = result.user;
					const formattedData: UserProfile = {
						first_name: userProfile.first_name || '',
						last_name: userProfile.last_name || '',
						username: userProfile.username || '',
						email: userProfile.email || '',
						role: userProfile.role || '',
						bio: userProfile.bio || '',
						location: userProfile.location || '',
						website: userProfile.website || '',
						phone: userProfile.phone || '',
						avatar: userProfile.avatar || '',
						banner: userProfile.banner || '',
					};
					setUserData(formattedData);
				} else {
					// No user found - redirect to create/edit page
					router.push(`/dashboard/user-profile/edit/${username}`);
				}
			} catch (err) {
				print.error('Error fetching user data:', err);
				setError('Failed to load user data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [authLoading, isAuthenticated, user?.id, router]);

	const handleEdit = () => {
		router.push(`/dashboard/user-profile/edit/${username}`);
	};

	// Show loading state while auth is loading or data is loading
	if (authLoading || isLoading) {
		return (
			<div className="container mx-auto py-8 px-4 max-w-full">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">User Profile</h1>
							<p className="text-muted-foreground">
								{authLoading ? 'Authenticating...' : 'Loading user information...'}
							</p>
						</div>
					</div>
					<div className="space-y-4">
						<div className="h-32 bg-muted animate-pulse rounded-lg"></div>
						<div className="h-64 bg-muted animate-pulse rounded-lg"></div>
					</div>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="container mx-auto py-8 px-4 max-w-full">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">User Profile</h1>
							<p className="text-muted-foreground text-destructive">{error}</p>
						</div>
					</div>
					<div className="text-center py-8">
						<p className="text-muted-foreground">Failed to load user data. Please try again.</p>
						<Button onClick={() => window.location.reload()} className="mt-4">
							Retry
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// If no user data, this shouldn't render as we redirect to edit page
	if (!userData) {
		return null;
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-full">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">User Profile</h1>
						<p className="text-muted-foreground">View your personal information and preferences</p>
					</div>
					<Button onClick={handleEdit} className="gap-2">
						<Edit2 className="h-4 w-4" />
						Edit Profile
					</Button>
				</div>

				{/* User Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building2 className="h-5 w-5" />
							Personal Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Avatar and Name Row */}
						<div className="flex items-start gap-6">
							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">Profile Picture</p>
								<Avatar className="h-20 w-20">
									<AvatarImage src={userData.avatar} />
									<AvatarFallback className="text-lg">
										{userData.first_name?.charAt(0) || 'U'}
										{userData.last_name?.charAt(0) || ''}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex-1 space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Full Name</p>
									<p className="text-lg font-semibold">
										{userData.first_name} {userData.last_name}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Username</p>
									<p className="text-sm">@{userData.username}</p>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium text-muted-foreground">Email</p>
									<p className="text-sm">{userData.email}</p>
								</div>
							</div>
						</div>

						{/* Role and Location Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Briefcase className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">Role</p>
									<p className="text-sm">{userData.role}</p>
								</div>
							</div>
							{userData.location && (
								<div className="flex items-center gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium text-muted-foreground">Location</p>
										<p className="text-sm">{userData.location}</p>
									</div>
								</div>
							)}
						</div>

						{/* Website and Phone Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{userData.website && (
								<div className="flex items-center gap-2">
									<ExternalLink className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium text-muted-foreground">Website</p>
										<a
											href={userData.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-600 hover:underline"
										>
											{userData.website}
										</a>
									</div>
								</div>
							)}
							{userData.phone && (
								<div className="flex items-center gap-2">
									<Globe className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium text-muted-foreground">Phone</p>
										<p className="text-sm">{userData.phone}</p>
									</div>
								</div>
							)}
						</div>

						{/* Bio */}
						{userData.bio && (
							<div>
								<p className="text-sm font-medium text-muted-foreground mb-2">Bio</p>
								<p className="text-sm leading-relaxed">{userData.bio}</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
