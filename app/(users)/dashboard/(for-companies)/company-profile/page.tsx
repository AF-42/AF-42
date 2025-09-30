'use client';

import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Building2, Mail, MapPin, Globe, Briefcase, ExternalLink } from 'lucide-react';

// Company profile data type
interface CompanyProfile {
	name: string;
	email: string;
	country: string;
	city: string;
	industry: string;
	description: string;
	website: string;
	logo: string;
	banner: string;
	phone: string;
}

export default function CompanyProfilePage() {
	const { user, isAuthenticated } = useKindeBrowserClient();
	console.log('[user]', user);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Fetch company data on component mount
	useEffect(() => {
		const fetchCompanyData = async () => {
			if (!isAuthenticated || !user?.id) {
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch('/api/companies/profile/user');
				console.log('[response]', response);

				if (!response.ok) {
					if (response.status === 404) {
						// Company not found - redirect to create/edit page
						router.push('/dashboard/company-profile/edit');
						return;
					}
					throw new Error('Failed to fetch company data');
				}

				const result = await response.json();
				if (result.success && result.hasCompany) {
					const company = result.company;
					const formattedData: CompanyProfile = {
						name: company.name || '',
						email: company.email || '',
						country: company.country || '',
						city: company.city || '',
						industry: company.industry || '',
						description: company.description || '',
						website: company.website || '',
						logo: company.logo || '',
						banner: company.banner || '',
						phone: company.phone || '',
					};
					setCompanyData(formattedData);
				} else {
					// No company found - redirect to create/edit page
					router.push('/dashboard/company-profile/edit');
				}
			} catch (err) {
				console.error('Error fetching company data:', err);
				setError('Failed to load company data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchCompanyData();
	}, [isAuthenticated, user?.id, router]);

	const handleEdit = () => {
		router.push('/dashboard/company-profile/edit');
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className="container mx-auto py-8 px-4 max-w-full">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Company Profile</h1>
							<p className="text-muted-foreground">Loading company information...</p>
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
							<h1 className="text-3xl font-bold">Company Profile</h1>
							<p className="text-muted-foreground text-destructive">{error}</p>
						</div>
					</div>
					<div className="text-center py-8">
						<p className="text-muted-foreground">Failed to load company data. Please try again.</p>
						<Button onClick={() => window.location.reload()} className="mt-4">
							Retry
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// If no company data, this shouldn't render as we redirect to edit page
	if (!companyData) {
		return null;
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-full">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Company Profile</h1>
						<p className="text-muted-foreground">View your company information and branding</p>
					</div>
					<Button onClick={handleEdit} className="gap-2">
						<Edit2 className="h-4 w-4" />
						Edit Profile
					</Button>
				</div>

				{/* Banner Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="h-5 w-5" />
							Company Banner
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="aspect-[3/1] w-full rounded-lg border bg-muted/10 flex items-center justify-center overflow-hidden">
							{companyData.banner ? (
								<img
									src={companyData.banner}
									alt="Company banner"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="text-center">
									<Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">No banner uploaded</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Company Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Building2 className="h-5 w-5" />
							Company Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Logo and Name Row */}
						<div className="flex items-start gap-6">
							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">Company Logo</p>
								<Avatar className="h-20 w-20">
									<AvatarImage src={companyData.logo} />
									<AvatarFallback className="text-lg">
										{companyData.name?.charAt(0) || 'C'}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex-1 space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Company Name</p>
									<p className="text-lg font-semibold">{companyData.name}</p>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm font-medium text-muted-foreground">Email</p>
									<p className="text-sm">{companyData.email}</p>
								</div>
							</div>
						</div>

						{/* Location Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">Location</p>
									<p className="text-sm">
										{companyData.city}, {companyData.country}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Briefcase className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-sm font-medium text-muted-foreground">Industry</p>
									<p className="text-sm">{companyData.industry}</p>
								</div>
							</div>
						</div>

						{/* Website and Phone Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{companyData.website && (
								<div className="flex items-center gap-2">
									<ExternalLink className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium text-muted-foreground">Website</p>
										<a
											href={companyData.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-600 hover:underline"
										>
											{companyData.website}
										</a>
									</div>
								</div>
							)}
						</div>

						{/* Description */}
						<div>
							<p className="text-sm font-medium text-muted-foreground mb-2">Company Description</p>
							<p className="text-sm leading-relaxed">{companyData.description}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
