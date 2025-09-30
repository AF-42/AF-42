'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, Upload, X, Building2, Mail, MapPin, Globe, Briefcase, ArrowLeft } from 'lucide-react';

// Form validation schema
const userProfileSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required'),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Invalid email address'),
	role: z.string().min(1, 'Role is required'),
	bio: z.string().optional(),
	location: z.string().optional(),
	website: z.string().url('Invalid website URL').optional().or(z.literal('')),
	avatar: z.string().optional(),
});

type UserProfileForm = z.infer<typeof userProfileSchema>;

const roles = [
	'Software Engineer',
	'Frontend Developer',
	'Backend Developer',
	'Full Stack Developer',
	'DevOps Engineer',
	'Data Scientist',
	'Machine Learning Engineer',
	'Product Manager',
	'UI/UX Designer',
	'QA Engineer',
	'Technical Lead',
	'Architect',
	'Mobile Developer',
	'Game Developer',
	'Cybersecurity Specialist',
	'Cloud Engineer',
	'Database Administrator',
	'System Administrator',
	'Other',
];

export default function EditUserProfilePage() {
	const { user, isAuthenticated } = useKindeBrowserClient();
	const router = useRouter();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [bannerPreview, setBannerPreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userData, setUserData] = useState<UserProfileForm | null>(null);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<UserProfileForm>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: '',
			last_name: '',
			username: '',
			email: '',
			role: '',
			bio: '',
			location: '',
			website: '',
			avatar: '',
		},
	});

	// Fetch user data on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			if (!isAuthenticated || !user?.id) {
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch('/api/users/profile');

				if (!response.ok) {
					if (response.status === 404) {
						// User not found - use initial data for new user
						setUserData(null);
						form.reset(form.getValues());
						return;
					}
					throw new Error('Failed to fetch user data');
				}

				const result = await response.json();
				if (result.success && result.user) {
					const userProfile = result.user;
					const formattedData: UserProfileForm = {
						first_name: userProfile.first_name || '',
						last_name: userProfile.last_name || '',
						username: userProfile.username || '',
						email: userProfile.email || '',
						role: userProfile.role || '',
						bio: userProfile.bio || '',
						location: userProfile.location || '',
						website: userProfile.website || '',
						avatar: userProfile.avatar || '',
					};
					setUserData(formattedData);
					form.reset(formattedData);
				} else {
					setUserData(null);
					form.reset(form.getValues());
				}
			} catch (err) {
				console.error('Error fetching user data:', err);
				setError('Failed to load user data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [form, isAuthenticated, user?.id]);

	const onSubmit = async (data: UserProfileForm) => {
		try {
			setIsSubmitting(true);
			const response = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Failed to save user profile');
			}

			// Redirect to the profile page after successful save
			router.push('/dashboard/user-profile');
		} catch (error) {
			console.error('Error saving profile:', error);
			setError('Failed to save user profile');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setAvatarPreview(e.target?.result as string);
				form.setValue('avatar', e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCancel = () => {
		router.push('/dashboard/user-profile');
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className="container mx-auto py-8 px-4 max-w-full">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Edit User Profile</h1>
							<p className="text-muted-foreground">Loading user information...</p>
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
							<h1 className="text-3xl font-bold">Edit User Profile</h1>
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

	return (
		<div className="container mx-auto py-8 px-4 max-w-full">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>
						<div>
							<h1 className="text-3xl font-bold">Edit User Profile</h1>
							<p className="text-muted-foreground">
								{userData
									? 'Update your personal information and preferences'
									: 'Create your user profile'}
							</p>
						</div>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
										<Label>Profile Picture</Label>
										<div className="relative">
											<Avatar className="h-20 w-20">
												<AvatarImage src={avatarPreview || form.watch('avatar')} />
												<AvatarFallback className="text-lg">
													{form.watch('first_name')?.charAt(0) || 'U'}
													{form.watch('last_name')?.charAt(0) || ''}
												</AvatarFallback>
											</Avatar>
											<div className="absolute -bottom-1 -right-1">
												<input
													type="file"
													accept="image/*"
													onChange={handleAvatarUpload}
													className="hidden"
													id="avatar-upload"
												/>
												<Button
													type="button"
													size="sm"
													className="h-8 w-8 rounded-full p-0"
													onClick={() => document.getElementById('avatar-upload')?.click()}
												>
													<Upload className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
									<div className="flex-1 space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="first_name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>First Name</FormLabel>
														<FormControl>
															<Input {...field} placeholder="Enter first name" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="last_name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Last Name</FormLabel>
														<FormControl>
															<Input {...field} placeholder="Enter last name" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormField
											control={form.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Enter username" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<Mail className="h-4 w-4" />
														Email
													</FormLabel>
													<FormControl>
														<Input {...field} type="email" placeholder="user@example.com" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Role and Location Row */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<Briefcase className="h-4 w-4" />
													Role
												</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{roles.map((role) => (
															<SelectItem key={role} value={role}>
																{role}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="location"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													Location
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Enter location" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Website and Phone Row */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="website"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Website</FormLabel>
												<FormControl>
													<Input {...field} placeholder="https://yourwebsite.com" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Bio */}
								<FormField
									control={form.control}
									name="bio"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bio</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Tell us about yourself..."
													className="min-h-[120px]"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Action Buttons */}
						<div className="flex justify-end gap-3">
							<Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
								<X className="h-4 w-4" />
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} className="gap-2">
								<Save className="h-4 w-4" />
								{isSubmitting ? 'Saving...' : userData ? 'Save Changes' : 'Create Profile'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
